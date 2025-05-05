import { Component } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-datetime',
  templateUrl: './datetime.page.html',
  styleUrls: ['./datetime.page.scss'],
  standalone: false,
  providers: [EventService],
})
export class DatetimePage {
  selectedDate: string | null = null;

  constructor(private eventService: EventService,
              private alertController: AlertController ) {}

  async saveEvent() {
    const alert = await this.alertController.create({
      header: 'Nuevo Evento',
      inputs: [
        {
          name: 'title',
          placeholder: 'Título del evento'
        },
        {
          name: 'desc',
          placeholder: 'Descripción'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Guardar',
          handler: (data) => {
            const event = {
              title: data.title,
              desc: data.desc,
              date: this.selectedDate
            };
            // Guardar el evento
            console.log('Evento guardado:', event);
          }
        }
      ]
    });
    await alert.present();
  }
}
