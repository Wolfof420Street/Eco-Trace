type SnowflakeConnection = {
  connect: (callback: (error?: Error) => void) => void;
  execute: (options: {
    sqlText: string;
    binds?: unknown[];
    complete: (error: Error | undefined, _stmt: unknown, rows: unknown[] | undefined) => void;
  }) => void;
};

let connectionPromise: Promise<SnowflakeConnection> | null = null;

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

async function getSnowflakeConnection(): Promise<SnowflakeConnection> {
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    const snowflakeModule = (await import("snowflake-sdk")) as {
      default?: {
        createConnection: (options: Record<string, string>) => SnowflakeConnection;
      };
      createConnection: (options: Record<string, string>) => SnowflakeConnection;
    };
    const snowflake = (snowflakeModule.default ?? snowflakeModule) as {
      createConnection: (options: Record<string, string>) => SnowflakeConnection;
    };

    const connection = snowflake.createConnection({
      account: requiredEnv("SNOWFLAKE_ACCOUNT"),
      username: requiredEnv("SNOWFLAKE_USERNAME"),
      password: requiredEnv("SNOWFLAKE_PASSWORD"),
      database: requiredEnv("SNOWFLAKE_DATABASE"),
      schema: requiredEnv("SNOWFLAKE_SCHEMA"),
      warehouse: requiredEnv("SNOWFLAKE_WAREHOUSE"),
      role: requiredEnv("SNOWFLAKE_ROLE")
    });

    await new Promise<void>((resolve, reject) => {
      connection.connect((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });

    return connection;
  })();

  return connectionPromise;
}

export async function querySnowflake<T>(sql: string, binds: unknown[] = []): Promise<T[]> {
  const connection = await getSnowflakeConnection();

  return new Promise<T[]>((resolve, reject) => {
    connection.execute({
      sqlText: sql,
      binds,
      complete: (error, _stmt, rows) => {
        if (error) {
          reject(error);
          return;
        }

        resolve((rows ?? []) as T[]);
      }
    });
  });
}
