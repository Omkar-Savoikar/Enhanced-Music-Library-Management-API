# Enhanced Music Library Management API

## Overview

In this assignment, you will develop a **Music Library Management API** that allows users within an organization to manage their collection of **Artists**, **Tracks**, and **Albums**. Each organization has a single Admin who oversees the system and its users. The API also provides functionality for users to mark their favorite Artists, Albums, and Tracks for quick access and personalization.

> ### Key Points
>
> - **One Organization, One Admin**: Each organization has a single Admin with full control over the system.
> - **Role-Based Access Control**: Users have distinct roles (Admin, Editor, Viewer), with permissions tailored to their responsibilities.
> - **Entity Relationships**: Albums belong to Artists, and Tracks are associated with Albums and Artists.
> - **Favorites**: Users can personalize their experience by marking items as favorites for easy retrieval.

## Hosting

The API is hosted at: [https://enhanced-music-library-management-api-o5iz.onrender.com](https://enhanced-music-library-management-api-o5iz.onrender.com)

## Features

### Authentication and Authorization

- Implement **authentication** and **role-based access control** using a method of your choice.
- **Roles**:
  - **Admin**: Full CRUD operations on all entities, including user management.
  - **Editor**: Can edit and delete Artists, Albums, Tracks, and their own details (e.g., updating their password).
  - **Viewer**: Read-only access to all entities.
- The first user registered in the system automatically becomes an **Admin**.

### Entity Management

1. **Users**:  
   Admins can manage users by adding, deleting, and updating their roles (except for other Admins).
2. **Artists, Albums, Tracks**:  
   Full CRUD operations based on role permissions.
3. **Favorites**:  
   Users can add or remove their favorite Artists, Albums, and Tracks.

## Assumptions

1. There is only one organisation.
2. The first user that sign's up will be an `admin`.
3. Every other user that sign's up will be a `viewer`.
4. An `admin` can add more users as `editor` or `viewer`.

## Diagrams

### Class Diagram

![Class Diagram](./images/Class%20Diagram.png?raw=true "Class Diagram")

### Sequence Diagram

![Sequence Diagram](./images/Sequence%20Diagram.png?raw=true "Sequence Diagram")
