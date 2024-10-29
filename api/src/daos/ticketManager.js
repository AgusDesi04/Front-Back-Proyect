import { ticketModel } from "./models/ticketModel";

class ticketManager {
  static async createTicket(newTicket){
    try {
      return await ticketModel.create(newTicket)
    } catch (error) {
      throw new Error(error)
    }
  }
}

export default ticketManager