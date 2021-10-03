import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PlayerDataModel } from "../base/model/PlayerDataModel";
import { dynamoDBClient } from "../base/api/DynamoDBClient";
import { CsvUtils, DateUtils, PLAYER_DATA_KEYS } from "../base/utilities";

@Component({
  selector: 'app-rushing',
  templateUrl: './rushing.component.html',
  styleUrls: ['./rushing.component.scss']
})
export class RushingComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[];
  dataSource: any;
  filterText: string;
  data: PlayerDataModel[];
  sortBy: string;
  sortOrder: boolean;
  searching: boolean;

  constructor() {
    this.filterText = '';
    this.sortBy = 'gsi1';
    this.sortOrder = false;
    this.searching = false;
    this.displayedColumns = PLAYER_DATA_KEYS;
  }

  async ngOnInit(): Promise<void> {
    await this.reloadData();
  }

  async doFilter(input: string) {
    console.debug("doFilter has been called");
    if (input && !/^ *$/.test(input)) {
      this.searching = true;
      this.data = await dynamoDBClient.queryPlayerDataWithFilter(this.sortBy, this.sortOrder, input.trim());
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
    } else {
      await this.reloadData();
    }
  }

  async reloadData() {
    this.searching = false;
    this.filterText = '';
    console.debug("reloadData has been called");
    this.data = await dynamoDBClient.queryPlayerData(this.sortBy, this.sortOrder);
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
  }

  downloadCsv() {
    CsvUtils.generateCsv("Player_Data_" + DateUtils.getDateFormatted('en-ca') + ".csv", this.data);
  }
}
