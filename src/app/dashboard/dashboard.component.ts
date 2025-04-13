import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
// export class DashboardComponent implements OnInit {
//   isDarkMode = false;
//   selectedFilter = 'all';


//   stats = [
//     { label: 'Formateurs', icon: 'group', count: 24, colorClass: 'bg-blue' },
//     { label: 'Admins', icon: 'admin_panel_settings', count: 5, colorClass: 'bg-green' },
//     { label: 'Candidats', icon: 'school', count: 112, colorClass: 'bg-purple' },
//     { label: 'Formations', icon: 'menu_book', count: 36, colorClass: 'bg-orange' }
//   ];

//   ngOnInit(): void {
//     const savedMode = localStorage.getItem('mode');
//     this.isDarkMode = savedMode === 'dark';
//   }

//   toggleDarkMode() {
//     this.isDarkMode = !this.isDarkMode;
//     localStorage.setItem('mode', this.isDarkMode ? 'dark' : 'light');
//   }

//   filteredStats() {
//     return this.selectedFilter === 'all'
//       ? this.stats
//       : this.stats.filter(stat => stat.label === this.selectedFilter);
//   }
// }
export class DashboardComponent implements OnInit {
  isDarkMode = false;
  stats = [
    { label: 'Formateurs', icon: 'group', count: 12, colorClass: 'blue' },
    { label: 'Admins', icon: 'admin_panel_settings', count: 3, colorClass: 'green' },
    { label: 'Candidats', icon: 'school', count: 84, colorClass: 'purple' },
    { label: 'Formations', icon: 'menu_book', count: 27, colorClass: 'orange' },
    { label: 'Examens', icon: 'assignment', count: 19, colorClass: 'teal' },
    { label: 'Taux de Réussite (%)', icon: 'trending_up', count: 74, colorClass: 'pink' }
  ];

  ngOnInit(): void {
    const savedMode = localStorage.getItem('mode');
    this.isDarkMode = savedMode === 'dark';
    
    
      setTimeout(() => this.drawCircleChart(), 100); // wait DOM
    }
    
    drawCircleChart() {
      const canvas = document.getElementById('circleChart') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
    
      const percent = 74;
      const angle = (percent / 100) * 2 * Math.PI;
    
      // Background circle
      ctx.beginPath();
      ctx.arc(60, 60, 50, 0, 2 * Math.PI);
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 10;
      ctx.stroke();
    
      // Progress circle
      ctx.beginPath();
      ctx.arc(60, 60, 50, -0.5 * Math.PI, angle - 0.5 * Math.PI);
      ctx.strokeStyle = '#4caf50';
      ctx.lineWidth = 10;
      ctx.stroke();
    
      // Text
      ctx.fillStyle = '#333';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(percent.toString(), 60, 65);
    }
    
  

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('mode', this.isDarkMode ? 'dark' : 'light');
  }

}