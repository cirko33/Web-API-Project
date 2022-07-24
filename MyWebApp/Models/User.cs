using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyWebApp.Models
{
    public enum Role { Visitor, Trainer, Owner }
    public enum Gender { Musko, Zensko, Drugo }
    public class User
    {
        string username;
        string password;
        string name;
        string lastname;
        Gender gender;
        string email;
        Role role;
        string birthDate;

        public User()
        {

        }

        public User(string username, string password, string name, string lastname, Gender gender, string email, Role role, DateTime birthDate)
        {
            this.username = username;
            this.password = password;
            this.name = name;
            this.lastname = lastname;
            this.gender = gender;
            this.email = email;
            this.role = role;
            this.birthDate = birthDate.ToString("dd/MM/yyyy");
        }

        public User(User user)
        {
            username = user.Username;
            password = user.Password;
            name = user.Name;
            lastname = user.Lastname;
            gender = user.Gender;
            email = user.Email;
            role = user.Role;
            birthDate = user.BirthDate;
        }

        public string Username { get => username; set => username = value; }
        public string Password { get => password; set => password = value; }
        public string Name { get => name; set => name = value; }
        public string Lastname { get => lastname; set => lastname = value; }
        public Gender Gender { get => gender; set => gender = value; }
        public string Email { get => email; set => email = value; }
        public Role Role { get => role; set => role = value; }
        public string BirthDate { get => birthDate; set => birthDate = value; }
    }
}