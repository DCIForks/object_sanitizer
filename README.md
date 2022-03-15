# OBJECT SANITIZER

When you receive data from an unreliable source, such as an API on a remote server, it may contain objects with missing or invalid properties.

You have two solutions:
1. At each step in the treatment of the data, you can check if the expected properties are present and valid, and treat exceptions as they occur
2. You can "sanitize" the incoming data, and set any missing or invalid properties to default usable values. You can then treat the data, knowing that it will not provoke any exceptions.

This repo shows two sanitization methods. One is simple, but it cannot deal with certain types of nested objects and arrays. The second is more complex. It works recursively, tunneling into all the branches of the input object and any internal arrays.

Both solutions require you to provide a template object with the required structure and with default values for each property.

## Schema

In the Backend module, you will encounter the Mongoose node module. This module allows you to create a "schema" for any objects that you need to use, and to enforce that schema.

The difference between a schema and a sanitizer is that a sanitizer will fix any invalid objects, while a schema will prevent you from using any objects with an invalid structure. Using a schema is a good way to ensure that the data that you _send_ to a database has a valid structure, so that you can be confident that any data that you subsequently _retrieve_ from the database is valid.