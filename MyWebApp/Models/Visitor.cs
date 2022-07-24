using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Serialization;

namespace MyWebApp.Models
{

    public class Visitor : User
    {
        List<int> trainings;
        public Visitor()
        {
            Role = Role.Visitor;
            Trainings = new List<int>();
        }

        public Visitor(User user):base(user)
        {
            Role = Role.Visitor;
            Trainings = new List<int>();
        }
        public Visitor(string username, string password, string name, string lastname, Gender gender, string email, DateTime birthDate) : base(username, password, name, lastname, gender, email, Role.Visitor, birthDate)
        {
            Trainings = new List<int>();
        }
        
        public List<int> Trainings { get => trainings; set => trainings = value; }
    }
}