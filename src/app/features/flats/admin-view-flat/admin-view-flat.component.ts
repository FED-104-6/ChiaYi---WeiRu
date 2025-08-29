import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, collectionData, doc, deleteDoc } from '@angular/fire/firestore';

interface Flat {
  id?: string;
  hostName: string;
  title: string;
  country: string;
  city: string;
  createdAt: string;
}

@Component({
  selector: 'app-admin-view-flat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-view-flat.component.html',
  styleUrls: ['./admin-view-flat.component.css']
})
export class AdminViewFlatComponent implements OnInit {
  flats: Flat[] = [];
  pagedFlats: Flat[] = [];

  filter = {
    startDate: '',
    endDate: '',
    country: '',
    city: ''
  };

  // 分頁控制
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    const colRef = collection(this.firestore, 'flats'); // flats collection
    collectionData(colRef, { idField: 'id' }).subscribe((data: any[]) => {
      this.flats = data.map(f => ({
        id: f.id,
        hostName: f.hostName || 'Host',
        title: f.title || '(No Title)',
        country: f.country || '',
        city: f.city || '',
        createdAt: f.createdAt || new Date().toISOString().split('T')[0]
      }));
      this.totalPages = Math.ceil(this.flats.length / this.itemsPerPage);
      this.setPagedFlats();
    });
  }

  /** 設定當前分頁資料 */
  setPagedFlats() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedFlats = this.flats.slice(start, end);
  }

  /** 下一頁 */
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.setPagedFlats();
    }
  }

  /** 上一頁 */
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.setPagedFlats();
    }
  }

  /** 套用篩選器 */
  applyFilter() {
    let filtered = [...this.flats];

    if (this.filter.startDate) {
      filtered = filtered.filter(f => f.createdAt >= this.filter.startDate);
    }
    if (this.filter.endDate) {
      filtered = filtered.filter(f => f.createdAt <= this.filter.endDate);
    }
    if (this.filter.country) {
      filtered = filtered.filter(f => f.country === this.filter.country);
    }
    if (this.filter.city) {
      filtered = filtered.filter(f => f.city === this.filter.city);
    }

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.currentPage = 1;
    this.pagedFlats = filtered.slice(0, this.itemsPerPage);
  }

  /** 刪除房源 */
  async deleteFlat(flat: Flat) {
    if (!flat.id) return;
    const docRef = doc(this.firestore, 'flats', flat.id);
    await deleteDoc(docRef);

    this.flats = this.flats.filter(f => f.id !== flat.id);
    this.totalPages = Math.ceil(this.flats.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    this.setPagedFlats();
  }
}
