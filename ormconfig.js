const path = require('path');

const isCompiled = __dirname.endsWith('dist');
const entityGlob = isCompiled
  ? path.join(__dirname, '**', '*.entity.js')
  : path.join(__dirname, 'src', '**', '*.entity.ts');

const dbConfig = {
  synchronize: false,
  migrations: [__dirname + '/migrations/**/*{.js,.ts}'],
  cli: {
    migrationsDir: 'migrations',
  },

  // optional
  migrationsRun: false,
  migrationsTableName: 'migrations',
  migrationsTransactionMode: 'all',
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      type: 'better-sqlite3',
      database: 'db.sqlite',
      entities: [entityGlob],
      autoLoadEntities: false,
      enableWAL: true,
      statementCacheSize: 100,
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'better-sqlite3',
      database: 'test.sqlite',
      entities: [entityGlob],
      autoLoadEntities: false,
      migrationsRun: true,
    });
    break;
  case 'production':
    break;
  default:
    throw new Error('Unknown environment.');
}

module.exports = dbConfig;
