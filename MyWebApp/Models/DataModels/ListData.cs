﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Xml.Serialization;

namespace MyWebApp.Models.DataModels
{
    public class ListData<T>
    {
        List<T> data;
        string path;
        XmlSerializer serializer = new XmlSerializer(typeof(List<T>));

        public ListData(string fileName)
        {
            path = AppDomain.CurrentDomain.BaseDirectory + "DataFiles/" + fileName + ".xml";
            data = new List<T>();
            ReadFile();
        }

        private void ReadFile()
        {
            if (!File.Exists(path))
                UpdateFile();
            using (TextReader r = new StreamReader(path))
            {
                data = (List<T>)serializer.Deserialize(r);
            }
        }

        public void UpdateFile()
        {
            //Update file
            using (TextWriter w = new StreamWriter(path, false))
            {
                serializer.Serialize(w, data);
            }
        }


        public void Add(T item)
        {
            data.Add(item);
            UpdateFile();
        }

        public bool Remove(T item)
        {
            if (data.Remove(item))
            {
                UpdateFile();
                return true;
            }
            return false;
        }

        public List<T> GetList()
        {
            return data;
        }

        public List<T> FindAll(Predicate<T> match)
        {
            return data.FindAll(match);
        }

        public T Find(Predicate<T> match)
        {
            return data.Find(match);
        }

       public T this[int index] { get => data[index]; set => data[index] = value; }
    }
}