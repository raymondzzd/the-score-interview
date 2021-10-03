import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
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
  // @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['Player', 'Team', 'Pos', 'Att', 'AttG', 'Yds', 'Avg', 'YdsG', 'TD', 'Lng', 'First', 'FirstPercent', 'TwentyPlus', 'FortyPlus', 'FUM'];
  dataSource: any;
  searching: boolean = false;
  filterText: string = '';
  data: PlayerDataModel[];
  selected = 'gsi1';

  constructor() {

  }

  async ngOnInit(): Promise<void> {
    await this.reloadData();
    // console.log(this.data);
  }

  async doFilter(input: string) {
    console.debug("doFilter has been called");
    if (input) {
      this.searching = true;
      this.data = await dynamoDBClient.getByPlayerName(this.selected, input);
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
    this.data = await dynamoDBClient.getAllData(this.selected);
    this.dataSource = new MatTableDataSource(this.data);
    // this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
