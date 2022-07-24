using MyWebApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MyWebApp.Controllers
{
    public class FitnessCenterController : ApiController
    {
        //GET /api/fitnesscenter
        public List<FitnessCenter> Get()
        {
            return Data.FitnessCenters.FindAll(x => !x.Deleted);
        }

        //GET /api/fitnesscenter/{id}
        public FitnessCenter Get(int id)
        {
            return Data.FitnessCenters.Find(f => !f.Deleted && f.Id == id);
        }

        //POST /api/fitnesscenter/{id}
        public IHttpActionResult Post(string id, [FromBody]FitnessCenter fc)
        {
            if (!Data.LoggedWithToken.ContainsKey(id))
                return BadRequest("Morate biti ulogovani");
            var u = Data.LoggedWithToken[id];
            if (Data.Owners.Find(x => x.Username == u.Username) == null)
                return BadRequest("Morate biti vlasnik da biste dodavali centre");

            if (string.IsNullOrWhiteSpace(fc.Name) || string.IsNullOrWhiteSpace(fc.Address))
                return BadRequest("Sva polja moraju biti uneta");
            fc.Owner = u.Username;
            Data.FitnessCenters.Add(fc);
            ((Owner)u).FitnessCenters.Add(fc.Id);
            Data.Owners.UpdateFile();
            return Ok();
        }

        //PUT /api/fitnesscenter/{id}
        public IHttpActionResult Put(string id, [FromBody]FitnessCenter fc)
        {
            if (!Data.LoggedWithToken.ContainsKey(id))
                return BadRequest("Morate biti ulogovani");
            var u = Data.LoggedWithToken[id];
            if (Data.Owners.Find(x => x.Username == u.Username) == null)
                return BadRequest("Morate biti vlasnik da biste menjali centre");

            if (string.IsNullOrWhiteSpace(fc.Name) || string.IsNullOrWhiteSpace(fc.Address))
                return BadRequest("Sva polja moraju biti uneta");
            if (!((Owner)u).FitnessCenters.Contains(fc.Id))
                return BadRequest("Nemate pristup tudjim fitnes centrima");
            var f = Data.FitnessCenters.Find(x => x.Id == fc.Id && !x.Deleted);
            if (f == null) return BadRequest("Ne postoji trening sa takvim Id-jem");
            if (f.Owner != u.Username) return BadRequest("Nije dozvoljeno menjati tudje fitnes centre");

            f.Name = fc.Name;
            f.Address = fc.Address;
            f.YearOfOpening = fc.YearOfOpening;
            f.MonthMembershipFee = fc.MonthMembershipFee;
            f.YearMembershipFee = fc.YearMembershipFee;
            f.OneGroupTrainingFee = fc.OneGroupTrainingFee;
            f.OnePersonalTrainingFee = fc.OnePersonalTrainingFee;
            f.OneTrainingFee = fc.OneTrainingFee;

            Data.FitnessCenters.UpdateFile();
            return Ok();
        }

        //DELETE /api/fitnesscenter/{id}
        public void Delete(string id)
        {
            string token = id.Split('_')[0];
            if (!Data.LoggedWithToken.ContainsKey(token))
                return;
            User u = Data.LoggedWithToken[token];
            if (Data.Owners.Find(u1 => u1.Username == u.Username) == null)
                return;

            int idN;
            if (!int.TryParse(id.Split('_')[1], out idN))
                return;
            var f = Data.FitnessCenters.Find(x => x.Id == idN);
            if (f == null)
                return;
            f.Deleted = true;
            List<Trainer> tr = Data.Trainers.FindAll(x => x.FitnessCenter == f.Id);
            if (tr != null)
                foreach (var i in tr)
                    i.Blocked = true;

            Data.Trainers.UpdateFile();
        }

        //GET /api/centersearch
        [HttpGet, Route("api/centersearch")]
        public List<FitnessCenter> GetCentersBySearch(string name, string address, string minYear, string maxYear)
        {
            int minNum, maxNum;

            if (!int.TryParse(minYear, out minNum)) minNum = -1;
            if (!int.TryParse(maxYear, out maxNum)) maxNum = -1;
            return Data.FitnessCenters.FindAll(f => !f.Deleted &&
                (!string.IsNullOrWhiteSpace(name) ? f.Name == name : true) &&
                (!string.IsNullOrWhiteSpace(address) ? f.Address.Contains(address) : true) &&
                (minNum > 0 ? f.YearOfOpening >= minNum : true) &&
                (maxNum > 0 ? f.YearOfOpening <= maxNum : true));
        }


        //GET /api/centertrainings/id (center id)
        [HttpGet, Route("api/centertrainings/{id}")]
        public List<GroupTraining> GetTrainings(int id)
        {
            return Data.Trainings.FindAll(t => t.FitnessCenter.Id == id && !t.Deleted && !t.History); 
        }

        //GET /api/sortcenters
        [HttpGet, Route("api/sortcenters")]
        public List<FitnessCenter> Sort(string sortBy, string sortOrder)
        {
            switch (sortBy)
            {
                case "Ime":
                    if (sortOrder == "Rastuce")
                        return Data.FitnessCenters.GetList().OrderBy(f => f.Name).ToList();
                    else
                        return Data.FitnessCenters.GetList().OrderByDescending(f => f.Name).ToList();
                case "Adresa":
                    if (sortOrder == "Rastuce")
                        return Data.FitnessCenters.GetList().OrderBy(f => f.Address).ToList();
                    else
                        return Data.FitnessCenters.GetList().OrderByDescending(f => f.Address).ToList();
                case "Godina":
                    if (sortOrder == "Rastuce")
                        return Data.FitnessCenters.GetList().OrderBy(f => f.YearOfOpening).ToList();
                    else
                        return Data.FitnessCenters.GetList().OrderByDescending(f => f.YearOfOpening).ToList();
                default:
                    return Data.FitnessCenters.GetList();
            }
        }

        //GET /api/ownercenters/{id}
        [HttpGet, Route("api/ownercenters/{id}")]
        public List<FitnessCenter> GetCenters(string id)
        {
            if (!Data.LoggedWithToken.ContainsKey(id))
                return null;
            var u = Data.LoggedWithToken[id];
            if (Data.Owners.Find(x => x.Username == u.Username) == null)
                return null;

            return Data.FitnessCenters.FindAll(x => !x.Deleted && ((Owner)u).FitnessCenters.Contains(x.Id));
        }

        [HttpGet, Route("api/centertrainers/{id}")]
        public List<UserInfo> GetCenters(int id)
        {
            var tr = Data.Trainers.FindAll(x => x.FitnessCenter == id && !x.Blocked);
            var info = new List<UserInfo>();
            if(tr != null)
                foreach (var i in tr)
                    info.Add(new UserInfo(i));

            return info;
        }

        [HttpGet, Route("api/candeletefc/{id}")]
        public bool CanDeleteFitnessCenter(int id)
        {
            return Data.Trainings.Find(x => x.FitnessCenter.Id == id && !x.Deleted && !x.History) == null;
        }
    }
}
