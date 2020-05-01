import { isEqual } from 'date-fns';
import Appointment from '../models/Appointments';

class AppointmentsRepository {
  private appointments: Appointment[];

  constructor() {
    this.appointments = [];
  }

  public list(): Appointment[] {
    return this.appointments;
  }

  public findByDate(date: Date): Appointment | null {
    const findAppointment = this.appointments.find(appointment =>
      isEqual(appointment.date, date),
    );

    return findAppointment || null;
  }

  public create(provider: string, date: Date): Appointment {
    // Creating a new appointment based on the Appointment model
    const appointment = new Appointment(provider, date);

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
