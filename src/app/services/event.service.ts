import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private STORAGE_KEY = 'calendar_events';

  async saveEvent(event: any): Promise<void> {
    const events = await this.getEvents();
    events.push(event);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
  }

  async getEvents(): Promise<any[]> {
    const events = localStorage.getItem(this.STORAGE_KEY);
    return events ? JSON.parse(events) : [];
  }

  async updateEvent(updatedEvent: any): Promise<void> {
    const events = await this.getEvents();
    const index = events.findIndex(e => e.id === updatedEvent.id);
    if (index !== -1) {
      events[index] = updatedEvent;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
    }
  }

  async deleteEvent(id: string): Promise<void> {
    const events = await this.getEvents();
    const filteredEvents = events.filter(e => e.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredEvents));
  }
}