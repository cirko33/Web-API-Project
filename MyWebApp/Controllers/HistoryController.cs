using MyWebApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MyWebApp.Controllers
{
    public class HistoryController : ApiController
    {
        //All trainings for user
        private List<GroupTraining> TrainingsForUser(string id)
        {
            if (!Data.LoggedWithToken.ContainsKey(id))
                return null;
            User u = Data.LoggedWithToken[id];
            List<GroupTraining> temp = new List<GroupTraining>();
            List<int> ids = new List<int>();
            if (u.Role == Role.Visitor)
                ids = ((Visitor)u).Trainings;
            else
                ids = ((Trainer)u).Trainings;

            foreach (var i in ids)
            {
                var t = Data.Trainings.Find(x => x.Id == i && !x.Deleted && x.History);
                if (t != null)
                    temp.Add(t);
            }
            
            return temp;
        }

        //GET /api/history/id
        public List<GroupTraining> Get(string id)
        {
            return TrainingsForUser(id); 
        }

        //GET /api/historysearch
        [HttpGet, Route("api/trainerhistorysearch")]
        public List<GroupTraining> GetHistoryBySearch(string token, string name, string trainingType, string dateMin, string dateMax)
        {
            var temp = TrainingsForUser(token);
            if (temp == null) return null;
            DateTime dMin, dMax;
            DateTime.TryParse(dateMin, out dMin);
            DateTime.TryParse(dateMax, out dMax);
            return temp.FindAll(t =>
                    (!string.IsNullOrWhiteSpace(name) ? t.Name == name : true) &&
                    (!string.IsNullOrWhiteSpace(trainingType) ? t.TrainingType == trainingType.Replace(" ", "") : true) &&
                    (!string.IsNullOrWhiteSpace(dateMin) ? DateTime.Parse(t.DateTimeOfTraining) >= dMin : true) &&
                    (!string.IsNullOrWhiteSpace(dateMax) ? DateTime.Parse(t.DateTimeOfTraining)  <= dMax: true));
        }

        //GET /api/historysearch
        [HttpGet, Route("api/historysearch")]
        public List<GroupTraining> GetHistoryBySearch(string id, string name, string trainingType, string centerName)
        {
            var temp = TrainingsForUser(id);
            if (temp == null) return null;
            return temp.FindAll(t =>
                    (!string.IsNullOrWhiteSpace(name) ? t.Name == name : true) &&
                    (!string.IsNullOrWhiteSpace(trainingType) ? t.TrainingType == trainingType.Replace(" ", "") : true) &&
                    (!string.IsNullOrWhiteSpace(centerName) ? t.FitnessCenter.Name == centerName : true));
        }

        //GET /api/sorthistory
        [HttpGet, Route("api/sorthistory")]
        public List<GroupTraining> Sort(string id, string sortBy, string sortOrder)
        {
            var trainings = TrainingsForUser(id);
            if (trainings == null) return null;
            switch (sortBy)
            {
                case "Naziv":
                    if (sortOrder == "Rastuce")
                        return trainings.OrderBy(f => f.Name).ToList();
                    else
                        return trainings.OrderByDescending(f => f.Name).ToList();
                case "Tip":
                    if (sortOrder == "Rastuce")
                        return trainings.OrderBy(f => f.TrainingType).ToList();
                    else
                        return trainings.OrderByDescending(f => f.TrainingType).ToList();
                case "Vreme":
                    if (sortOrder == "Rastuce")
                        return trainings.OrderBy(f => DateTime.Parse(f.DateTimeOfTraining)).ToList();
                    else
                        return trainings.OrderByDescending(f => DateTime.Parse(f.DateTimeOfTraining)).ToList();
                default:
                    return trainings;
            }
        }
    }
}
