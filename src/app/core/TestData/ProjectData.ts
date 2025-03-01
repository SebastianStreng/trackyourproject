import { Project } from "../models/project";


export class ProjectData {
  static getProjects(): Project[] {
    return [
      {
        id: 1,
        name: 'Projekt Alpha',
        description: 'Ein innovatives Technologieprojekt zur Automatisierung.',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-06-30'),
        members: [],
        tasks: []
      },
      {
        id: 2,
        name: 'Projekt Beta',
        description: 'Ein Forschungsprojekt im Bereich der Künstlichen Intelligenz.',
        startDate: new Date('2023-09-15'),
        endDate: new Date('2024-12-20'),
        members: [],
        tasks: []
      },
      {
        id: 3,
        name: 'Projekt Gamma',
        description: 'Ein Infrastrukturprojekt zur Modernisierung der IT-Systeme.',
        startDate: new Date('2022-05-10'),
        endDate: new Date('2023-11-30'),
        members: [],
        tasks: []
      },
      {
        id: 4,
        name: 'Projekt Delta',
        description: 'Ein nachhaltiges Umweltprojekt zur Reduktion von Emissionen.',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2025-09-30'),
        members: [],
        tasks: []
      },
      {
        id: 5,
        name: 'Projekt Epsilon',
        description: 'Ein digitales Transformationsprojekt für Unternehmen.',
        startDate: new Date('2023-06-20'),
        endDate: new Date('2024-08-15'),
        members: [],
        tasks: []
      }
    ];
  }
}