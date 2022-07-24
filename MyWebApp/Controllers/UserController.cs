using MyWebApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Web.Http;

namespace MyWebApp.Controllers
{
    public class UserController : ApiController
    {
        private bool CheckIfExists(string username, string email)
        {
            return Data.Visitors.Find(u => u.Username == username || u.Email == email) != null ||
                 Data.Owners.Find(u => u.Username == username || u.Email == email) != null ||
                 Data.Trainers.Find(u => u.Username == username || u.Email == email) != null;
        }
        //GET /api/user/{id}
        public User Get(string id)
        {
            if (!Data.LoggedWithToken.ContainsKey(id))
                return null;

            return Data.LoggedWithToken[id];
        }

        //PUT /api/user
        public IHttpActionResult Put([FromUri]string id, [FromBody]User user)
        {
            DateTime dateTime;
            if (DateTime.TryParse(user.BirthDate, out dateTime))
                user.BirthDate = dateTime.ToString("dd/MM/yyyy");

            if (!Data.LoggedWithToken.ContainsKey(id))
                return BadRequest();
            User u1 = Data.LoggedWithToken[id];
            if(u1.Username != user.Username)
                if (Data.Visitors.Find(u => u.Username == user.Username) != null ||
                    Data.Owners.Find(u => u.Username == user.Username) != null ||
                    Data.Trainers.Find(u => u.Username == user.Username && !u.Blocked) != null)
                    return BadRequest("Postoji korisnik sa takvim korisnickim imenom");
            if (string.IsNullOrWhiteSpace(user.Name) || string.IsNullOrWhiteSpace(user.Lastname) ||
                string.IsNullOrWhiteSpace(user.Username)  || string.IsNullOrWhiteSpace(user.BirthDate) || 
                string.IsNullOrWhiteSpace(user.Password))
                return BadRequest("Sva polja moraju biti popunjena");

            u1.Name = user.Name;
            u1.Lastname = user.Lastname;
            u1.Username = user.Username;
            u1.Email = user.Email;
            u1.Gender = user.Gender;
            u1.BirthDate = user.BirthDate;
            u1.Password = user.Password;
            if (u1.Role == Role.Owner)
                Data.Owners.UpdateFile();
            else if (u1.Role == Role.Visitor)
                Data.Visitors.UpdateFile();
            else
                Data.Trainers.UpdateFile();
            return Ok();
        }

        //POST /api/user REGISTRATION
        public IHttpActionResult Post(User user)
        {
            user.Role = Role.Visitor;
            DateTime dateTime;
            if (DateTime.TryParse(user.BirthDate, out dateTime))
                user.BirthDate = dateTime.ToString("dd/MM/yyyy");
            
            //if any of properties are null
            if (user.GetType().GetProperties().Select(i => i.GetValue(user)).Any(v => v == null)) 
                return BadRequest("Sva polja moraju biti popunjena");
            if (CheckIfExists(user.Username, user.Email))
                return BadRequest("Korisnicko ime vec postoji");
            Data.Visitors.Add(new Visitor(user));
            return Created("User", user.Username);
        }

        //POST /api/login
        [HttpPost, Route("api/login")]
        public IHttpActionResult Login(User user)
        {
            if (string.IsNullOrWhiteSpace(user.Username) || string.IsNullOrWhiteSpace(user.Password))
                return BadRequest();

            User ret = Data.Visitors.Find(u => u.Username == user.Username && u.Password == user.Password);
            if (ret == null)
                ret = Data.Trainers.Find(u => u.Username == user.Username && u.Password == user.Password && !u.Blocked);
            if (ret == null)
                ret = Data.Owners.Find(u => u.Username == user.Username && u.Password == user.Password);

            if (ret == null)
                return BadRequest("Lose uneti podaci");

            string token = Convert.ToBase64String(Encoding.ASCII.GetBytes(ret.Username + "token")).Replace("=", "");
            Data.LoggedWithToken[token] = ret;
            return Ok(token);
        }

        //DELETE /api/logout/{id}
        [HttpDelete, Route("api/logout/{id}")]
        public IHttpActionResult Logout(string id)
        {
            if(Data.LoggedWithToken.Remove(id))
                return Ok();
            return BadRequest();
        }

        //GET /api/role/{id}
        [HttpGet, Route("api/role/{id}")]
        public string GetRole(string id)
        {
            if (!Data.LoggedWithToken.ContainsKey(id))
                return null;
           
            return Enum.GetName(typeof(Role), Data.LoggedWithToken[id].Role);
        }

        //GET /api/userinfo/{id}
        [HttpGet, Route("api/userinfo/{id}")]
        public UserInfo GetInfo(string id)
        {
            User u = Data.Trainers.Find(x => x.Username == id && !x.Blocked);
            if (u == null)
                u = Data.Owners.Find(x => x.Username == id);
            if (u == null)
                u = Data.Visitors.Find(x => x.Username == id);

            if (u == null) return null;

            return new UserInfo(u);
        }   

        public class TrainerInsert
        {
            public string Username { get; set; }
            public string Password { get; set; }
            public string Name { get; set; }
            public string Lastname { get; set; }
            public Gender Gender { get; set; }
            public string Email { get; set; }
            public Role Role { get; set; }
            public string BirthDate { get; set; }
            public int Fc { get; set; }
        }
        [HttpPost, Route("api/trainerregistration/{id}")]
        public IHttpActionResult RegisterTrainer(string id, [FromBody]TrainerInsert ti)
        {
            if (!Data.LoggedWithToken.ContainsKey(id))
                return BadRequest("Morate biti prijavljeni da biste dodali trenere");
            User u = Data.LoggedWithToken[id];
            if(u.Role != Role.Owner)
                return BadRequest("Morate biti vlasnik da biste dodali trenere");
            if (string.IsNullOrWhiteSpace(ti.BirthDate) || string.IsNullOrWhiteSpace(ti.Name) ||
                string.IsNullOrWhiteSpace(ti.Lastname) || string.IsNullOrWhiteSpace(ti.Username) ||
                string.IsNullOrWhiteSpace(ti.Password) || string.IsNullOrWhiteSpace(ti.Email))
                return BadRequest("Sva polja moraju biti popunjenja");
            if (CheckIfExists(ti.Username, ti.Email))
                return BadRequest("Username already exists");
            FitnessCenter fc = Data.FitnessCenters.Find(x => x.Id == ti.Fc);
            if (fc == null)
                return BadRequest("Ne postoji takav fitnes centar");
            DateTime temp;
            if (!DateTime.TryParse(ti.BirthDate, out temp)) return BadRequest("Datum nepravilno unesen");
            Data.Trainers.Add(new Trainer(ti.Username, ti.Password, ti.Name, ti.Lastname, ti.Gender, ti.Email, temp, ti.Fc));
            return Ok();
        }

        public class ForToken { public string Token { get; set; } }
        [HttpPost, Route("api/blocktrainer/{id}")]
        public IHttpActionResult BlockTrainer(string id, [FromBody]ForToken t)
        {
            if (!Data.LoggedWithToken.ContainsKey(t.Token))
                return BadRequest("Niste ulogovani");
            User u = Data.LoggedWithToken[t.Token];
            if (u.Role != Role.Owner)
                return BadRequest("Niste vlasnik");
            var tr = Data.Trainers.Find(x => x.Username == id);
            if (tr == null)
                return BadRequest("Ne postoji takav trener");
            if (!((Owner)u).FitnessCenters.Contains(tr.FitnessCenter))
                return BadRequest("Nemate pristup tudjim fitnes centrima");
            tr.Blocked = true;
            Data.Trainers.UpdateFile();
            return Ok();
        }
    }
}
