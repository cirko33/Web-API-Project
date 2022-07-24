using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyWebApp.Models
{
    public enum TrainingType { YOGA, LESMILLSTONE, BODYATTACK, LESMILLSCORE }
    public class GroupTraining
    {
        bool deleted = false;
        bool history = false;
        int id;
        string name;
        TrainingType trainingType;
        FitnessCenter fitnessCenter;
        int trainingDuration;
        string dateTimeOfTraining;
        int maxNumberOfVisitors;
        List<string> visitors;

        public GroupTraining()
        {
            Visitors = new List<string>();
        }


        public GroupTraining(string name, TrainingType trainingType, FitnessCenter fitnessCenter, int trainingDuration, DateTime dateTimeOfTraining, int maxNumberOfVisitors, List<string> visitors)
        {
            this.id = Data.GetIdTrainings();
            this.name = name;
            this.trainingType = trainingType;
            this.fitnessCenter = fitnessCenter;
            this.trainingDuration = trainingDuration;
            this.dateTimeOfTraining = dateTimeOfTraining.ToString("dd/MM/yyyy HH:mm");
            this.maxNumberOfVisitors = maxNumberOfVisitors;
            this.visitors = visitors;
        }

        public GroupTraining(string name, TrainingType trainingType, FitnessCenter fitnessCenter, int trainingDuration, DateTime dateTimeOfTraining, int maxNumberOfVisitors)
        {
            this.id = Data.GetIdTrainings();
            this.name = name;
            this.trainingType = trainingType;
            this.fitnessCenter = fitnessCenter;
            this.trainingDuration = trainingDuration;
            this.dateTimeOfTraining = dateTimeOfTraining.ToString("dd/MM/yyyy HH:mm");
            this.maxNumberOfVisitors = maxNumberOfVisitors;
            visitors = new List<string>();
        }

        public int Id { get => id; set => id = value; }
        public string Name { get => name; set => name = value; }
        public string TrainingType { get => Enum.GetName(typeof(TrainingType), trainingType); set => Enum.TryParse(value, out trainingType); }
        public FitnessCenter FitnessCenter { get => fitnessCenter; set => fitnessCenter = value; }
        public int TrainingDuration { get => trainingDuration; set => trainingDuration = value; }
        public string DateTimeOfTraining { get => dateTimeOfTraining; set => dateTimeOfTraining = value; }
        public int MaxNumberOfVisitors { get => maxNumberOfVisitors; set => maxNumberOfVisitors = value; }
        public List<string> Visitors { get => visitors; set => visitors = value; }
        public bool Deleted { get => deleted; set => deleted = value; }
        public bool History { get => history; set => history = value; }
    }
}