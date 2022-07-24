using MyWebApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace MyWebApp
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            Data.CreateData();

            Task t = Task.Run(() =>
            {
                while (true)
                {
                    List<GroupTraining> tr = Data.Trainings.FindAll(x => !x.Deleted && !x.History && DateTime.Parse(x.DateTimeOfTraining) < DateTime.Now);
                    if(tr != null && tr.Count != 0)
                        tr.ForEach(x => x.History = true);

                    Thread.Sleep(60000);
                }
            });
        }
    }
}
