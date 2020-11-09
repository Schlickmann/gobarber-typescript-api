import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('Appointments Services', () => {
  describe('CreateAppointment', () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    it('should create a new appointment', async () => {
      const appointment = await createAppointment.execute({
        date: new Date('12/12/2020'),
        provider_id: '232321321312',
      });

      expect(appointment).toHaveProperty('id');
      expect(appointment.provider_id).toBe('232321321312');
    });

    it('should not create two appointments in the same date/time', async () => {
      // let error;
      // try {
      //   await createAppointment.execute({
      //     date: new Date('12/12/2020'),
      //     provider_id: '232321321312',
      //   });
      // } catch (e) {
      //   error = e;
      // }
      // expect(error).toEqual(
      //   new AppError(
      //     'Operation not permitted. Date and time select is already booked.',
      //   ),
      // );

      expect(
        createAppointment.execute({
          date: new Date('12/12/2020'),
          provider_id: '232321321312',
        }),
      ).rejects.toEqual(
        new AppError(
          'Operation not permitted. Date and time select is already booked.',
        ),
      );
    });
  });
});
