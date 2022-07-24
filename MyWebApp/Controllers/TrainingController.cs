using MyWebApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MyWebApp.Controllers
{
    public class TrainingController : ApiController
    {
        public class TrainingAdd
        {
            public string Name { get; set; }
            public string TrainingType { get; set; }
            public int Duration { get; set; }
            public string Date { get; set; }
            public int MaxVisitors { get; set; }
        }

        //DELETE /api/training/{id}
        public void Delete(int id)
        {
            var temp = Data.Trainings.Find(t => t.Id == id);
            if(temp != null)
            {
                if (temp.Visitors.Count != 0) return;
                temp.Deleted = true;
                Data.Trainings.UpdateFile();
            }
        }

        //GET /api/training/{id}
        public GroupTraining Get(int id)
        {
            return Data.Trainings.Find(t => t.Id == id && !t.Deleted && !t.History);
        }

        //PUT /api/training
        public IHttpActionResult Put(int id, [FromBody]TrainingAdd t)
        {
            
            if (t.Name == null || t.TrainingType == null || t.Duration < 0 || t.Date == null || t.MaxVisitors <= 0)
                return BadRequest();
            var trn = Data.Trainings.Find(tr => tr.Id == id && !tr.Deleted && !tr.History);
            if (trn == null) return BadRequest("ne postoji trening sa takvim id-em");
            trn.Name = t.Name;
            trn.MaxNumberOfVisitors = t.MaxVisitors;
            trn.TrainingDuration = t.Duration;
            DateTime temp;
            if (!DateTime.TryParse(t.Date, out temp)) return BadRequest("Lose uneti datum i vreme");
            if (trn.DateTimeOfTraining != temp.ToString("dd/MM/yyyy HH:mm")) {
                if (temp < DateTime.Now.AddDays(3))
                    return BadRequest("Ponovno zakazivanje minimalno 72h pred termin");
                trn.DateTimeOfTraining = temp.ToString("dd/MM/yyyy HH:mm");
            }
            trn.TrainingType = t.TrainingType;
            Data.Trainings.UpdateFile();
            return Ok();
        }

        //POST /api/training/{id}
        public IHttpActionResult Post(string id,[FromBody]TrainingAdd t)
        {
            if (!Data.LoggedWithToken.ContainsKey(id))
                return BadRequest("Sva polja moraju biti popunjena");
            if (t.Name == null || t.TrainingType == null || t.Duration < 0 || t.Date == null
                 || t.MaxVisitors <= 0)
                return BadRequest("Sva polja moraju biti popunjena");
            Trainer tr = (Trainer)Data.LoggedWithToken[id];
            TrainingType tt;
            if(!Enum.TryParse(t.TrainingType.Replace(" ", ""), out tt)) return BadRequest("Lose unet tip");
            DateTime temp;
            if (!DateTime.TryParse(t.Date, out temp)) return BadRequest("Lose uneti datum i vreme");

            FitnessCenter fc = Data.FitnessCenters.Find(x => x.Id == tr.FitnessCenter && !x.Deleted);
            var trn = new GroupTraining(t.Name, tt, fc, t.Duration, temp, t.MaxVisitors);
            if (DateTime.Parse(trn.DateTimeOfTraining) < DateTime.Now.AddDays(3))
                return BadRequest("Morate minimalno 3 dana ranije zakazati trening (72h)");
            Data.Trainings.Add(trn);
            tr.Trainings.Add(trn.Id);
            Data.Trainers.UpdateFile();
            return Ok();
        }


        public class SignTraining
        {
            public string Token { get; set; }
            public int Id { get; set; }
        }

        //POST /api/trainingsignin
        [HttpPost, Route("api/trainingsignin")]
        public IHttpActionResult SignIn(SignTraining tr)
        {
            GroupTraining training = Data.Trainings.Find(t => t.Id == tr.Id && !t.Deleted && !t.History);
            if (!Data.LoggedWithToken.ContainsKey(tr.Token))
                return BadRequest("Niste ulogovani");
            User user = Data.LoggedWithToken[tr.Token];
            if (training != null && user != null && user.Role == Role.Visitor)
            {
                if (training.Visitors.Find(u => u == user.Username) != null)
                    return BadRequest("Vec ste prijavljeni na trening");

                training.Visitors.Add(user.Username);
                Data.Trainings.UpdateFile();
                ((Visitor)user).Trainings.Add(training.Id);
                Data.Visitors.UpdateFile();
                return Ok();
            }
            return BadRequest();
        }

        //POST /api/trainingsignout 
        [HttpPost, Route("api/trainingsignout")]
        public IHttpActionResult SignOut(SignTraining tr)
        {
            GroupTraining training = Data.Trainings.Find(t => t.Id == tr.Id && !t.Deleted && !t.History);
            if (!Data.LoggedWithToken.ContainsKey(tr.Token))
                return BadRequest("Niste ulogovani");
            User user = Data.LoggedWithToken[tr.Token];
            if (training != null && user != null && user.Role == Role.Visitor)
            {
                if (training.Visitors.Remove(user.Username))
                {
                    ((Visitor)user).Trainings.Remove(training.Id);
                    Data.Trainings.UpdateFile();
                    Data.Visitors.UpdateFile();
                    return Ok();
                }
            }
            return BadRequest();
        }

        //GET /api/trainertrainings/{id}
        [HttpGet, Route("api/trainertrainings/{id}")]
        public List<GroupTraining> GetTrainingsForTrainer(string id)
        {
            if (!Data.LoggedWithToken.ContainsKey(id))
                return null;
            Trainer t = (Trainer)Data.LoggedWithToken[id];
            List<GroupTraining> temp = new List<GroupTraining>();
            foreach (var i in t.Trainings)
            {
                var t1 = Data.Trainings.Find(x => x.Id == i && !x.Deleted && !x.History);
                if (t1 != null)
                    temp.Add(t1);
            }
            return temp;
        }

        public class TrainingVisitor { public string Username { get; set; } public string Name { get; set; } public string Lastname { get; set; }}
        [HttpGet, Route("api/trainingvisitors/{id}")]
        public List<TrainingVisitor> GetVisitors(int id)
        {
            var ret = new List<TrainingVisitor>();
            var tr = Data.Trainings.Find(t => t.Id == id && !t.Deleted);
            if(tr != null)
            {
                foreach (var i in tr.Visitors)
                {
                    var temp = Data.Visitors.Find(x => x.Username == i);
                    if (temp != null) ret.Add(new TrainingVisitor() { Username = i, Name = temp.Name, Lastname = temp.Lastname });
                }   
            }
            return ret;
        }
    }
}
