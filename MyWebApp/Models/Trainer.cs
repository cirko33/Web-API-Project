using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyWebApp.Models
{
    public class Trainer : User
    {
        bool blocked = false;
        List<int> trainings;
        int fitnessCenter;
        public Trainer()
        {
            trainings = new List<int>();
        }

        public Trainer(string username, string password, string name, string lastname, Gender gender, string email, DateTime birthDate) : base(username, password, name, lastname, gender, email, Role.Trainer, birthDate)
        {
            trainings = new List<int>();
        }

        public Trainer(string username, string password, string name, string lastname, Gender gender, string email, DateTime birthDate, int fitnessCenter) : base(username, password, name, lastname, gender, email, Role.Trainer, birthDate)
        {
            trainings = new List<int>();
            FitnessCenter = fitnessCenter;
        }


        public List<int> Trainings { get => trainings; set => trainings = value; }
        public int FitnessCenter { get => fitnessCenter; set => fitnessCenter = value; }
        public bool Blocked { get => blocked; set => blocked = value; }
    }
}