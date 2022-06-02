const { conn } = require("../../../../app");

class Transaction {
  constructor() {}
  async StartTransaction() {
    this.session = await conn.startSession();
    this.session.startTransaction();
  }
  async CommitTransaction() {
    await this.session.commitTransaction();
    this.session.endSession();
  }
  async AbortTransaction() {
    await this.session.abortTransaction();
    this.session.endSession();
  }
}
module.exports = Transaction;
