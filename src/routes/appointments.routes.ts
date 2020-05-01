import { Router } from 'express';
import { startOfHour, parseISO } from 'date-fns';

import AppointmentRepository from '../repositories/AppointmentRepository';

const appointmentsRouter = Router();

const appointmentRepository = new AppointmentRepository();

appointmentsRouter.post('/', (request, response) => {
  const { provider, date } = request.body;

  const parsedDate = startOfHour(parseISO(date));

  const isDateNotAvailable = appointmentRepository.findByDate(parsedDate);

  if (isDateNotAvailable) {
    return response.status(401).json({
      error: 'Operation not permitted. Date and time select is already booked.',
    });
  }

  const appointment = appointmentRepository.create(provider, parsedDate);

  return response.json(appointment);
});

export default appointmentsRouter;
