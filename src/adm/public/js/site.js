var interval = null;

document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    initApp();
  }
};

function initApp () {
  const divContent = document.querySelector("div.content");

	let html = '<button onclick="startTimer()">Play</button>';
	html += '<button onclick="pauseTimer()">Pause</button>';

  html += `
    <div class="row">
		<div class="col-md-5">
			<table class="table table-sm table-striped datatable" id="tbPool">
				<thead>
						<tr>
							<th class="text-center"></th>
            <th class="text-center">
							Size
						</th>
						<th class="text-center">
							Max Workers Size
						</th>
						<th class="text-center">
							Has Free Worker ?
						</th>
						<th class="text-center">
							Queue Size
						</th>
						<th class="text-center">
							Max Queue Size
						</th>
					</tr>
				</thead>
				<tbody>
				</tbody>
			</table>
		</div>
        <div class="col-md-4"></div>
		<div class="col-md-3"></div>
    </div>`;

  html += `
    <div class="row">
		<div class="col-md-5">
			<table class="table table-sm table-striped datatable" id="tbWorkers">
				<thead>
					<tr>
						<th class="text-center">
							Worker ID
						</th>
						<th class="text-center">
							Busy ?
						</th>
						<th class="text-center">
							Busy Time (sec)
						</th>
						<th class="text-center">
							Method In Execution
						</th>
						<th class="text-center">
							Method's arguments
						</th>
					</tr>
				</thead>
				<tbody>
				</tbody>
			</table>
		</div>
    <div class="col-md-4"></div>
		<div class="col-md-3"></div>
    </div>`;
	divContent.innerHTML = html;
	addModalHtml();
  startTimer();
}

function refresh () {
  $.ajax({
    url: "/refresh",
    method: "get",
    error (err) {
      alert(JSON.stringify(err));
    },
    success (data) {
      refreshScreen(data);
    }
  });
};

function refreshScreen (data) {
  const tbWorkersBody = document.querySelector("#tbWorkers > tbody");
  const tbPoolBody = document.querySelector("#tbPool > tbody");
  let html = "";

  data.workers.forEach(worker => {

		let method = worker.method;

		if (method.length > 15) {
			method = `<a data-toggle="modal" href="" onclick="exibirModal(${worker.threadId})">${worker.method.substring(0, 15)}</a>`;
		}

    html += `<tr>
					<td class="text-center">
						${worker.threadId}
					</td>
					<td class="text-center">
						${returnHtmlCheckbox(worker.busy)}
					</td>
					<td class="text-center">
						${worker.busyTime}
					</td>
					<td class="text-center">
						${method}
					</td>
					<td class="text-center">
						${JSON.stringify(worker.args)}
					</td>
				</tr>`;
  });

  tbWorkersBody.innerHTML = html;

  html = `<tr>
				<td class="text-center"></td>
				<td class="text-center">
					${data.size}
				</td>
				<td class="text-center">
					${data.maxSize}
				</td>
				<td class="text-center">
					${returnHtmlCheckbox(data.hasFreeWorker)}
				</td>
				<td class="text-center">
					${data.queueSize}
				</td>
				<td class="text-center">
					${data.queueMaxSize}
				</td>
			</tr>`;

	tbPoolBody.innerHTML = html;
}

function returnHtmlCheckbox (checked) {
  return `<input type="checkbox"
				class="form-check-input" ${checked ? "checked" : ""}
				onclick="this.checked = !this.checked" />`;
}

function pauseTimer () {
	clearInterval(interval);
}

function startTimer () {
	interval = setInterval(() => {
    refresh();
  }, 2 * 1000);
}

function addModalHtml() {
	const divContent = document.querySelector("div.content");

	let html = `
	<!--<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modalFunction">
		Launch demo modal
	</button> -->

	<!-- Modal -->
	<div class="modal fade" id="modalFunction" tabindex="-1" role="dialog" aria-labelledby="modalFunction" aria-hidden="true">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body" id="modalFunctionBody">
					...
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>
	`;

	divContent.innerHTML += html;
}

function exibirModal(method) {
	$.ajax({
    url: "/refresh",
    method: "get",
    error (err) {
      alert(JSON.stringify(err));
    },
    success (data) {
			const worker = data.workers.filter(w => w.threadId === method);
			if (worker.length > 0) {
				document.querySelector("#modalFunctionBody").innerHTML = worker[0].method;
				$("#modalFunction").modal();
			}
    }
	});
}