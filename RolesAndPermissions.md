# 🏢 Office Management System (OMS)

## 🔐 Role & Permission Structure

---

## 👑 SUPER ADMIN & HR

> Super Admin and HR have full system access.

- Full access to all modules
- Full CRUD (Create, Read, Update, Delete) on all resources
- Can manage all departments, teams, users, projects, tasks, attendance, leave, shift, DCR, learning resources, etc.

---

# 🗂️ PROJECT MANAGER

## 📌 Task Management

- Full CRUD on tasks
- Can create and assign tasks to team members within the same department
- Can update task status of any assigned team member

## 📝 DCR Management

- Can view all DCRs of department team members
- Can provide feedback on each DCR

## 📁 Project Management

- Can view all projects under their department

## 👥 User Management

- Can view all users in their department
- Can view user-specific projects

## 📊 Performance Management

- Can view overall department performance
- Can view individual team member performance

## 🕒 Attendance Management

- Can submit own attendance
- Can update attendance status of department team members
- Can manage weekend exchange requests of department team members

## 🌴 Leave Management

- Can submit own leave request
- Can approve/reject department team members' leave requests
- Own leave requests are managed by Super Admin or Director

## 🔄 Shift Management

- Can submit own shift change request
- Can approve/reject department team members' shift change requests
- Own shift change requests are managed by Super Admin or Director
- Can assign duty shifts to department team members

## 📚 Learning Management

- Full CRUD on department learning resources

---

# 👨‍💼 TEAM LEADER

## 📌 Task Management

- Full CRUD on tasks
- Can create and assign tasks to self and team members within the same department
- Can update task status of assigned team members

## 📝 DCR Management

- Can submit own DCR (status update only by Project Manager)
- Can view all DCRs of own team members
- Can provide feedback on each DCR

## 📁 Project Management

- Can view all projects under their team

## 👥 User Management

- Can view all users in their team
- Can view user-specific projects

## 🕒 Attendance Management

- Can submit own attendance
- Can update attendance status of team members
- Can manage weekend exchange requests of team members

## 🌴 Leave Management

- Can submit own leave request

## 🔄 Shift Management

- Can submit own shift change request

## 📚 Learning Management

- Can view all learning resources of their team

---

# 👨‍💻 EMPLOYEE

## 📌 Task Management

- Full CRUD on own tasks only
- Cannot update a task after it is marked as completed

## 📝 DCR Management

- Can submit own DCR (status update only by Project Manager or Team Leader)
- Cannot update DCR after completion
- Can provide feedback on own DCR

## 🕒 Attendance Management

- Can submit own attendance
- Can request weekend exchange for own schedule

## 🌴 Leave Management

- Can submit own leave request

## 🔄 Shift Management

- Can submit own shift change request

## 📚 Learning Management

- Can view all learning resources of their team

---

# 📌 Permission Hierarchy Overview

```
SUPER ADMIN / HR
        ↓
PROJECT MANAGER
        ↓
TEAM LEADER
        ↓
EMPLOYEE
```

Higher roles inherit and extend lower-level permissions within their scope.
