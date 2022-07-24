using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyWebApp.Models
{
    public enum Status { UNRESOLVED, DECLINED, ACCEPTED }
    public class Comment
    {
        int id;
        Status status = Status.UNRESOLVED;
        string visitor;
        int fitnessCenter;
        string text;
        int mark;

        public Comment()
        {
            id = Data.GetIdComments();
        }

        public Comment(string visitor, int fitnessCenter, string text, int mark)
        {
            id = Data.GetIdComments();
            Visitor = visitor;
            FitnessCenter = fitnessCenter;
            Text = text;
            Mark = mark;
        }

        public string Visitor { get => visitor; set => visitor = value; }
        public int FitnessCenter { get => fitnessCenter; set => fitnessCenter = value; }
        public string Text { get => text; set => text = value; }
        public int Mark { get => mark; set => mark = value; }
        public Status Status { get => status; set => status = value; }
        public int Id { get => id; set => id = value; }
    }
}