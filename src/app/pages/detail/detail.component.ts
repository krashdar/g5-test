import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Unsubscriber } from '../../core/unsubscriber';
import { ActivatedRoute } from '@angular/router';
import { GithubService } from '../../core/services/github-service/github.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent extends Unsubscriber {

  user: any;

  constructor(private route: ActivatedRoute,
              private githubService: GithubService) {
    super();

    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.githubService.getUser(username)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(user => {
          this.user = user;
        });
    }
  }
}
