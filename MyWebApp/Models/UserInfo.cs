using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyWebApp.Models
{
    public class UserInfo
    {
        public string Username { get; set; }
        public string Name { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string Gender { get; set; }
        public string BirthDate { get; set; }

        public UserInfo()
        {

        }
        public UserInfo(User u)
        {
            Username = u.Username;
            Name = u.Name;
            Lastname = u.Lastname;
            Email = u.Email;
            Gender = u.Gender.ToString();
            BirthDate = u.BirthDate;
        }
    }
}