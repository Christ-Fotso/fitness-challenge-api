# DEV_A - Authentification & Utilisateurs

## Fichiers à Commiter

### Phase 1 : Configuration Initiale
```
✅ package.json
✅ tsconfig.json
✅ .env.example
✅ .gitignore
✅ drizzle.config.ts (si pas fait par DEV_P)
```

### Phase 2 : Base de Données
```
✅ src/config/database.ts
✅ src/shared/schema.ts (tables: users, user_points)
```

### Phase 3 : Point d'Entrée
```
✅ src/index.ts
```

### Phase 4 : Authentification
```
✅ src/services/auth.service.ts
✅ src/controllers/auth.controller.ts
```

### Phase 5 : Gestion Utilisateurs
```
✅ src/services/user.service.ts
✅ src/controllers/user.controller.ts
✅ src/storage/storage.ts (méthodes users)
```

### Phase 6 : Badges
```
✅ src/shared/schema.ts (tables: badges, user_badges)
✅ src/services/badge.service.ts
✅ src/controllers/badge.controller.ts
✅ src/storage/storage.ts (méthodes badges)
```

### Phase 7 : Exports & Routes
```
✅ src/services/index.ts
✅ src/controllers/index.ts
✅ src/routes.ts
```

---

## Ordre des Commits

### Commit 1 : Configuration du projet
```bash
git add package.json tsconfig.json .env.example .gitignore
git commit -m "feat: initial project setup and configuration"
```

### Commit 2 : Base de données
```bash
git add src/config/database.ts
git commit -m "feat: add database connection configuration"
```

### Commit 3 : Schéma utilisateurs
```bash
git add src/shared/schema.ts
git commit -m "feat: add user and user_points schema"
```

### Commit 4 : Point d'entrée
```bash
git add src/index.ts
git commit -m "feat: add express server entry point"
```

### Commit 5 : Service d'authentification
```bash
git add src/services/auth.service.ts
git commit -m "feat: implement authentication service with JWT and bcrypt"
```

### Commit 6 : Contrôleur d'authentification
```bash
git add src/controllers/auth.controller.ts
git commit -m "feat: add auth controller with register and login endpoints"
```

### Commit 7 : Service utilisateurs
```bash
git add src/services/user.service.ts
git commit -m "feat: implement user management service"
```

### Commit 8 : Contrôleur utilisateurs
```bash
git add src/controllers/user.controller.ts
git commit -m "feat: add user controller with CRUD and leaderboard"
```

### Commit 9 : Storage utilisateurs
```bash
git add src/storage/storage.ts
git commit -m "feat: add user storage methods with repository pattern"
```

### Commit 10 : Schéma badges
```bash
git add src/shared/schema.ts
git commit -m "feat: add badge and user_badges schema with dynamic rules"
```

### Commit 11 : Service badges
```bash
git add src/services/badge.service.ts
git commit -m "feat: implement badge service with award system"
```

### Commit 12 : Contrôleur badges
```bash
git add src/controllers/badge.controller.ts
git commit -m "feat: add badge controller with award endpoint"
```

### Commit 13 : Storage badges
```bash
git add src/storage/storage.ts
git commit -m "feat: add badge storage methods"
```

### Commit 14 : Exports
```bash
git add src/services/index.ts src/controllers/index.ts
git commit -m "feat: add service and controller exports"
```

### Commit 15 : Routes
```bash
git add src/routes.ts
git commit -m "feat: register auth, user and badge routes"
```

---

## Méthodes Storage à Implémenter

Dans `src/storage/storage.ts` :

```typescript
// Users
getUser(id: string)
getUserByEmail(email: string)
createUser(user: InsertUser)
updateUserStatus(id: string, isActive: boolean)
deleteUser(id: string)
getAllUsers()

// Badges
getBadge(id: string)
getAllBadges()
createBadge(badge: InsertBadge)
deleteBadge(id: string)
awardBadge(userId: string, badgeId: string)
getUserBadges(userId: string)

// Points
getUserPoints(userId: string)
updateUserPoints(userId: string, points: number)
getLeaderboard(limit: number)
```

---

## Routes à Tester

### Authentification
- POST /api/auth/register
- POST /api/auth/login

### Utilisateurs
- GET /api/users
- GET /api/users/:id
- PATCH /api/users/:id/status
- DELETE /api/users/:id
- GET /api/users/:id/points
- GET /api/users/leaderboard/top

### Badges
- GET /api/badges
- GET /api/badges/:id
- POST /api/badges
- POST /api/badges/award
- GET /api/badges/user/:userId
- DELETE /api/badges/:id

---

## Checklist

- [ ] Tous les fichiers copiés dans dev_a/
- [ ] Commits effectués dans l'ordre
- [ ] Tests Postman réussis
- [ ] Code compile sans erreur
- [ ] Documentation à jour
