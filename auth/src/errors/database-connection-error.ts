import { CustomError } from "./cutom-error"

export class DatabaseConnection extends CustomError {
  reason = "Error connecting to database"
  statusCode = 500
  constructor() {
    super("Error connecting to database")

    Object.setPrototypeOf(this, DatabaseConnection.prototype)
  }
  serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ]
  }
}
