# backup

Backup script to create a backup of the database and the storage / plugins directories.
Uses node v16 and yarn v2

Install with
```
yarn set version berry
yarn install
```

To create a backup of current database, storage and plugins:
```bash
yarn backup:create
```

WIP (not yet functional): To restore a stored backup (multiple-choice prompt):
```bash
yarn backup:restore
```
