using MyWebApp.Models.DataModels;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Web;

namespace MyWebApp.Models
{
    public class Data
    {
        public static ListData<FitnessCenter> FitnessCenters;
        public static ListData<Visitor> Visitors;
        public static ListData<Owner> Owners;
        public static ListData<Trainer> Trainers;
        public static ListData<GroupTraining> Trainings;
        public static ListData<Comment> Comments;
        public static Dictionary<string, User> LoggedWithToken;

        public static void CreateData()
        {
            FitnessCenters = new ListData<FitnessCenter>("fitnesscenters");
            Owners = new ListData<Owner>("owners");
            Visitors = new ListData<Visitor>("visitors");
            Trainers = new ListData<Trainer>("trainers");
            Trainings = new ListData<GroupTraining>("trainings");
            Comments = new ListData<Comment>("comments");
            LoggedWithToken = new Dictionary<string, User>();
        }

        public static int GetIdTrainings()
        {
            if (Trainings == null)
                return -1;
            var temp = Trainings.GetList();
            if (temp.Count == 0) return 0;
            int id = temp[temp.Count - 1].Id + 1;
            if (temp.Find(x => x.Id == id) == null)
                return id;
            for (int i = 0; ; i++)
                if (temp.Find(x => x.Id == i) == null)
                    return i;
        }

        public static int GetIdCenters()
        {
            if (FitnessCenters == null)
                return -1;
            var temp = FitnessCenters.GetList();
            if (temp.Count == 0) return 0;
            int id = temp[temp.Count - 1].Id + 1;
            if (temp.Find(x => x.Id == id) == null)
                return id;
            for (int i = 0; ; i++)
                if (temp.Find(x => x.Id == i) == null)
                    return i;
        }

        public static int GetIdComments()
        {
            if (Comments == null)
                return -1;
            var temp = Comments.GetList();
            if (temp.Count == 0) return 0;
            int id = temp[temp.Count - 1].Id + 1;
            if (temp.Find(x => x.Id == id) == null)
                return id;
            for (int i = 0; ; i++)
                if (temp.Find(x => x.Id == i) == null)
                    return i;
        }
    }
}