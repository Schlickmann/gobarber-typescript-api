import { Router } from 'express';
import { uuid } from 'uuidv4';
import { startOfHour, parseISO, isEqual } from 'date-fns';

const appointmentsRouter = Router();

interface Appointment {
  id: string;
  provider: string;
  date: Date;
}

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

  const appointment = { id: uuid(), provider, date: parsedDate };

  appointments.push(appointment);

  return response.json(appointment);
});

export default appointmentsRouter;
