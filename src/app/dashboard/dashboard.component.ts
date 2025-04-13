import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isDarkMode = false;
  selectedFilter = 'all';


  stats = [
    { label: 'Formateurs', icon: 'group', count: 24, colorClass: 'bg-blue' },
    { label: 'Admins', icon: 'admin_panel_settings', count: 5, colorClass: 'bg-green' },
    { label: 'Candidats', icon: 'school', count: 112, colorClass: 'bg-purple' },
    { label: 'Formations', icon: 'menu_book', count: 36, colorClass: 'bg-orange' }
  ];

  ngOnInit(): void {
    const savedMode = localStorage.getItem('mode');
    this.isDarkMode = savedMode === 'dark';
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('mode', this.isDarkMode ? 'dark' : 'light');
  }

  filteredStats() {
    return this.selectedFilter === 'all'
      ? this.stats
      : this.stats.filter(stat => stat.label === this.selectedFilter);
  }
}
