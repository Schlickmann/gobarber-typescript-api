import { Router } from 'express';
import { startOfHour, parseISO, isEqual } from 'date-fns';

import Appointment from '../models/Appointments';

const appointmentsRouter = Router();

// Defining type of appointments array
const appointments: Appointment[] = [];

appointmentsRouter.post('/', (request, response) => {
  const { provider, date } = request.body;

  const parsedDate = startOfHour(parseISO(date));

  const isDateNotAvailable = appointments.find(appointment =>
    isEqual(appointment.date, parsedDate),
  );

  if (isDateNotAvailable) {
    return response.status(401).json({
      error: 'Operation not permitted. Date and time select is already booked.',
    });
  }

  // Creating a new appointment based on the Appointment model
  const appointment = new Appointment(provider, parsedDate);

  appointments.push(appointment);

  return response.json(appointment);
});

export default appointmentsRouter;
