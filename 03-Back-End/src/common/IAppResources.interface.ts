import * as mysql2 from "mysql2/promise";

interface IAppResource{
    databaseConnection: mysql2.Connection;
}

export default IAppResource;