import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentRepository from '../repositories/AppointmentRepository';

// Data Transfer Object
interface RequestDTO {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ date, provider }: RequestDTO): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentRepository);

    const appointmentDate = startOfHour(date);

    const isDateNotAvailable = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (isDateNotAvailable) {
      throw Error(
        'Operation not permitted. Date and time select is already booked.',
      );
    }

    // creates instance of appointment
    const appointment = appointmentsRepository.create({
      provider,
      date: appointmentDate,
    });

    // saves the instance
    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
