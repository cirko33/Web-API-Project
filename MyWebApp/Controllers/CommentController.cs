using MyWebApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MyWebApp.Controllers
{
    public class CommentController : ApiController
    {
        //GET /api/comment/id
        public List<Comment> Get(int id)
        {
            return Data.Comments.FindAll(t => t.FitnessCenter == id && t.Status == Status.ACCEPTED);
        }

        //GET /api/comment/id
        [HttpGet, Route("api/allcomments/{id}")]
        public List<Comment> GetAllComments(int id)
        {
            return Data.Comments.FindAll(t => t.FitnessCenter == id );
        }

        //POST /api/comment/
        public IHttpActionResult Post(string id, [FromBody]Comment comment)
        {
            if (!Data.LoggedWithToken.ContainsKey(id))
                return BadRequest("Niste ulogovani");
            User u = Data.LoggedWithToken[id];
            FitnessCenter fc = Data.FitnessCenters.Find(f => f.Id == comment.FitnessCenter);
            if(fc != null && u != null && u.Role == Role.Visitor && !string.IsNullOrWhiteSpace(comment.Text) && comment.Mark > 0 && comment.Mark < 5  )
            {
                Data.Comments.Add(new Comment(u.Username, fc.Id, comment.Text, comment.Mark));
                return Ok();
            }
            return BadRequest("Sva polja moraju biti popunjena");
        }

        //GET /api/canleavecomment/
        [HttpGet, Route("api/canleavecomment")]
        public bool CanLeaveComment(string token, int id)
        {
            if (!Data.LoggedWithToken.ContainsKey(token))
                return false;
            string u = Data.LoggedWithToken[token].Username;
            return Data.Trainings.Find(t => t.FitnessCenter.Id == id && t.Visitors.Contains(u) && t.History) != null;
        }


        //PUT /api/comment/{id}
        public IHttpActionResult Put(string id, [FromBody]Comment c)
        {
            if (!Data.LoggedWithToken.ContainsKey(id))
                return BadRequest("Morate biti ulogovani");

            var u = Data.LoggedWithToken[id];
            if(u.Role != Role.Owner)
                return BadRequest("Morate biti vlasnik");

            var cm =  Data.Comments.Find(x => x.Id == c.Id);
            if (cm == null)
                return BadRequest("Ne postoji takav komentar");
            cm.Status = c.Status;
            Data.Comments.UpdateFile();
            return Ok();
        }
    }
}
