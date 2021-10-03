import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {PlayerDataModel} from "../base/model/PlayerDataModel";
import {dynamoDBClient} from "../base/api/DynamoDBClient";

@Component({
  selector: 'app-rushing',
  templateUrl: './rushing.component.html',
  styleUrls: ['./rushing.component.scss']
})
export class RushingComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['Player', 'Team', 'Pos', 'Att', 'AttG', 'Yds', 'Avg', 'YdsG', 'TD', 'Lng', 'LngTD', 'First', 'FirstPercent', 'TwentyPlus', 'FortyPlus', 'FUM'];
  dataSource: any;
  searching: boolean = false;
  filterText: string = '';
  data: PlayerDataModel[];
  sortBy = 'gsi1';
  sortOrder = false;

  constructor() {

  }

  async ngOnInit(): Promise<void> {
    await this.reloadData();
  }

  async doFilter(input: string) {
    console.debug("doFilter has been called");
    if (input && !/^ *$/.test(input)) {
      this.searching = true;
      this.data = await dynamoDBClient.getByPlayerName(this.sortBy, this.sortOrder, input);
      this.dataSource = new MatTableDataSource(this.data);
      // this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } else {
      await this.reloadData();
    }
  }

  async reloadData() {
    this.searching = false;
    this.filterText = '';
    console.debug("reloadData has been called");
    this.data = await dynamoDBClient.getAllData(this.sortBy, this.sortOrder);
    this.dataSource = new MatTableDataSource(this.data);
    // this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
