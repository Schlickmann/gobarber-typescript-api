import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Appointment from '../models/Appointment';
import AppointmentRepository from '../repositories/AppointmentRepository';

// Data Transfer Object
interface RequestDTO {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({
    date,
    provider_id,
  }: RequestDTO): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentRepository);

    const appointmentDate = startOfHour(date);

    const isDateNotAvailable = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (isDateNotAvailable) {
      throw new AppError(
        'Operation not permitted. Date and time select is already booked.',
      );
    }

    // creates instance of appointment
    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    // saves the instance
    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
