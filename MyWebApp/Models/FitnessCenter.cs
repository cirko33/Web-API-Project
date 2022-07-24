using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyWebApp.Models
{
    public class Address
    {
        public Address()
        {

        }

        public Address(string street, string number, string city, string postNumber)
        {
            Street = street;
            Number = number;
            City = city;
            PostNumber = postNumber;
        }

        public string Street { get; set; }
        public string Number { get; set; }
        public string City { get; set; }
        public string PostNumber { get; set; }

        public override string ToString()
        {
            return $"{Street} {Number}, {City}, {PostNumber}";
        }

    }
    public class FitnessCenter
    {
        bool deleted = false;
        int id;
        string name;
        Address address;
        int yearOfOpening;
        string owner;
        double monthMembershipFee;
        double yearMembershipFee;
        double oneTrainingFee;
        double oneGroupTrainingFee;
        double onePersonalTrainingFee;

        public FitnessCenter()
        {
            Id = Data.GetIdCenters();
        }

        public FitnessCenter(string name, Address address, int yearOfOpening, string owner, double monthMembershipFee, double yearMembershipFee, double oneTrainingFee, double oneGroupTrainingFee, double onePersonalTrainingFee)
        {
            Id = Data.GetIdCenters();
            Name = name;
            this.address = address;
            YearOfOpening = yearOfOpening;
            Owner = owner;
            MonthMembershipFee = monthMembershipFee;
            YearMembershipFee = yearMembershipFee;
            OneTrainingFee = oneTrainingFee;
            OneGroupTrainingFee = oneGroupTrainingFee;
            OnePersonalTrainingFee = onePersonalTrainingFee;
        }

        public bool Deleted { get => deleted; set => deleted = value; }
        public int Id { get => id; set => id = value; }
        public string Name { get => name; set => name = value; }
        public string Address { get => address.ToString(); set { string[] splited = value.Split(','); address = new Address(splited[0].Split(' ')[0], splited[0].Split(' ')[1], splited[1].TrimStart(), splited[2].TrimStart()); } }
        public int YearOfOpening { get => yearOfOpening; set => yearOfOpening = value; }
        public string Owner { get => owner; set => owner = value; }
        public double MonthMembershipFee { get => monthMembershipFee; set => monthMembershipFee = value; }
        public double YearMembershipFee { get => yearMembershipFee; set => yearMembershipFee = value; }
        public double OneTrainingFee { get => oneTrainingFee; set => oneTrainingFee = value; }
        public double OneGroupTrainingFee { get => oneGroupTrainingFee; set => oneGroupTrainingFee = value; }
        public double OnePersonalTrainingFee { get => onePersonalTrainingFee; set => onePersonalTrainingFee = value; }
    }
}