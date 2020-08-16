import { startOfHour } from 'date-fns';

import AppError from '@shared/errors/AppError';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

// Data Transfer Object
interface IRequestDTO {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  constructor(private appointmentsRepository: IAppointmentsRepository) {}

  public async execute({
    date,
    provider_id,
  }: IRequestDTO): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const isDateNotAvailable = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (isDateNotAvailable) {
      throw new AppError(
        'Operation not permitted. Date and time select is already booked.',
      );
    }

    // creates instance of appointment
    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
