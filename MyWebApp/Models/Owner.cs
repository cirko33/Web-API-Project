using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyWebApp.Models
{
    public class Owner : User
    {
        List<int> fitnessCenters;

        public Owner()
        {
            fitnessCenters = new List<int>();
        }

        public Owner(string username, string password, string name, string lastname, Gender gender, string email, DateTime birthDate) : base(username, password, name, lastname, gender, email, Role.Owner, birthDate)
        {
            fitnessCenters = new List<int>();
        }

        public Owner(string username, string password, string name, string lastname, Gender gender, string email, DateTime birthDate, List<int> fitnessCenters) : base(username, password, name, lastname, gender, email, Role.Owner, birthDate)
        {
            FitnessCenters = fitnessCenters;
        }

        public List<int> FitnessCenters { get => fitnessCenters; set => fitnessCenters = value; }
    }
}