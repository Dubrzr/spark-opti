function fixVal(valName, value, fromName = "") {
  $(valName).addClass('flashit');
  if (!fromName === "")
  	$(fromName).addClass('flashit');
  $(fromName).addClass('flashit');
  setTimeout(function () {
    $('input').removeClass('flashit');
		$(valName).val(value);
  }, 1000);
}

function setText(valName, value, colorClass) {
  $(valName).text(value);
  $(valName).addClass(colorClass);
}

function delText(valName) {
	$(valName).text("");
}
  

$( "input" ).blur(function() {
	var node_count = parseInt($("#node_count").val());
  if (node_count < 1) {
  	fixVal("#node_count", 1);
    node_count = 1;
  }
  var val01 = node_count;
  $("#val01").text(val01);
  
	var node_cores = parseInt($("#node_cores").val());
  if (node_cores < 1) {
  	fixVal("#node_cores", 1);
    node_cores = 1;
  }
  var val02 = node_count*node_cores;
  $("#val02").text(val02);
  
	var node_pmem = parseInt($("#node_pmem").val());
  if (node_pmem < 1) {
  	fixVal("#node_pmem", 1);
  }
  var val03 = node_count*node_pmem;
  $("#val03").text(val03);

  
	var yarn_nm_resrc_mem_mb = parseInt($("#yarn_nm_resrc_mem_mb").val());
  if (yarn_nm_resrc_mem_mb < 1) {
  	fixVal("#yarn_nm_resrc_mem_mb", 1);
    yarn_nm_resrc_mem_mb = 1;
  }
  if (yarn_nm_resrc_mem_mb > node_pmem) {
  	fixVal("#yarn_nm_resrc_mem_mb", node_pmem, "#node_pmem");
    yarn_nm_resrc_mem_mb = node_pmem;
  }
  
  if (yarn_nm_resrc_mem_mb > node_pmem * 0.95) {
  	var val10 = "You should not allocate more than 95% of the memory of a node to YARN (consider lowering yarn.nodemanager.resource.memory-mb)";
    setText("#val10", val10, "orange");
  } else
 		delText("#val10");
    
    
  var yarn_sched_min_alloc_mb = parseInt($("#yarn_sched_min_alloc_mb").val());
  if (yarn_sched_min_alloc_mb < 1) {
  	fixVal("#yarn_sched_min_alloc_mb", 1);
    yarn_sched_min_alloc_mb = 1;
  }
    
	var yarn_sched_max_alloc_mb = parseInt($("#yarn_sched_max_alloc_mb").val());
  if (yarn_sched_max_alloc_mb < 1) {
  	fixVal("#yarn_sched_max_alloc_mb", 1);
    yarn_sched_max_alloc_mb = 1;
  }
  if (yarn_sched_max_alloc_mb > yarn_nm_resrc_mem_mb) {
  	fixVal("#yarn_sched_max_alloc_mb", yarn_nm_resrc_mem_mb, "#yarn_nm_resrc_mem_mb");
    yarn_sched_max_alloc_mb = yarn_nm_resrc_mem_mb;
  }
  if (yarn_sched_min_alloc_mb > yarn_sched_max_alloc_mb) {
  	fixVal("#yarn_sched_min_alloc_mb", yarn_sched_max_alloc_mb, "#yarn_sched_max_alloc_mb");
    yarn_sched_min_alloc_mb = yarn_sched_max_alloc_mb;
  }
  
  var val04 = node_count*yarn_nm_resrc_mem_mb;
  $("#val04").text(val04);  
  
	var yarn_nm_vpmem_ratio = parseFloat($("#yarn_nm_vpmem_ratio").val());
  
  var val05 = yarn_nm_vpmem_ratio * yarn_sched_max_alloc_mb;
  $("#val05").text(val05);
  
	var yarn_nm_resrc_cpu_vcores = parseInt($("#yarn_nm_resrc_cpu_vcores").val());
  if (yarn_nm_resrc_cpu_vcores > node_cores) {
  	fixVal("#yarn_nm_resrc_cpu_vcores", node_cores, "#node_cores");
    yarn_nm_resrc_cpu_vcores = node_cores;
  }
  
	var wanted_pmem = parseInt($("#wanted_pmem").val());
  
	$("#wanted_vmem").val(wanted_pmem*yarn_nm_vpmem_ratio);
  
  if (wanted_pmem < yarn_sched_min_alloc_mb) {
  	var val06 = "You should set yarn.scheduler.minimum-allocation-mb to a smaller value than pmem.";
    setText("#val06", val06, "orange");
  } else
 		delText("#val06");
  
  var spark_yarn_exec_memOverhead = parseInt($("#spark_yarn_exec_memOverhead").val());
  
  var trtd = '<tr><td></td><td></td><td style="text-align: center;" colspan="' + (yarn_nm_resrc_cpu_vcores-1) + '">spark.executors.cores</td></tr>';
  
  for(var line=0; line < yarn_nm_resrc_cpu_vcores; line++) {
  	if (line === 0)
    	trtd += '<tr><td></td>';
  	else if (line === 1)
      trtd += '<tr><td rowspan="' + (yarn_nm_resrc_cpu_vcores-1) + '"><div class="verticalText">num-executors</div></td>';
    for(var col=0; col < yarn_nm_resrc_cpu_vcores; col++) {
      if (line === 0 && col === 0)
        trtd += '<td></td>';
    	else if (line === 0)
      	trtd += '<td>' + col + '</td>';
      else if (col === 0)
      	trtd += '<td>' + line + '</td>';
      else {
      	var tmp = line*spark_yarn_exec_memOverhead+col*wanted_pmem;
        if (tmp < yarn_sched_max_alloc_mb) {
        var val = line*col + '/' + tmp ;
        	if (line*col < node_cores)
        		trtd += '<td class="green-bg">' + val + '</td>';
          else
          	trtd += '<td class="orange-bg">' + val + '</td>';
        }
        else
        	trtd += '<td class="red-bg">' + val + '</td>';
      }
    }
    trtd += "</tr>"
  }
  $("#recom").html(trtd);
  
  
  $("#val07").text(Math.floor(best_score/best_vcores));
  $("#val08").text(best_vcores);
  $("#val09").text(wanted_pmem*Math.floor(best_score/best_vcores)*best_vcores+spark_yarn_exec_memOverhead*Math.floor(best_score/best_vcores));
});


