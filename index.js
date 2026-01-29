let students = [];

async function Dispaly() {
  const res = await fetch("http://localhost:3000/getperson");
  const person = await res.json();

  let table = document.getElementById("container");
  let str = "";

  person.map((element) => {
    let chem = Number(element.chem);
    let phy = Number(element.phy);
    let bio = Number(element.bio);
    let maths = Number(element.maths);

    let total = chem + phy + bio + maths;
    let avg = total / 4;

    let result =
      chem < 24 || phy < 24 || bio < 24 || maths < 24 ? "FAIL" : "PASS";

    let grade = "F";
    if (avg >= 90) grade = "A";
    else if (avg >= 70) grade = "B";
    else if (avg >= 45) grade = "C";
    else if (avg >= 24) grade = "D";

    str += `
      <tr>
        <td><input id="name-${element._id}" value="${element.name}" disabled></td>
        <td><input id="age-${element._id}" value="${element.age}" disabled></td>
        <td><input id="class-${element._id}" value="${element.class}" disabled></td>
        <td><input id="chem-${element._id}" value="${element.chem}" disabled></td>
        <td><input id="phy-${element._id}" value="${element.phy}" disabled></td>
        <td><input id="bio-${element._id}" value="${element.bio}" disabled></td>
        <td><input id="maths-${element._id}" value="${element.maths}" disabled></td>

        <td>${grade}</td>
        <td style="color:${result === "PASS" ? "green" : "red"}">${result}</td>

        <td>
          <button id="edit-${element._id}" onclick="Edit('${element._id}')">Edit</button>
          <button id="save-${element._id}" onclick="Save('${element._id}')" style="display:none">Save</button>
        </td>

        <td>
          <button onclick="Delete('${element._id}')">Delete</button>
        </td>
      </tr>
    `;
  });

  table.innerHTML = str;
}

function Edit(id) {
  document.getElementById(`name-${id}`).disabled = false;
  document.getElementById(`age-${id}`).disabled = false;
  document.getElementById(`class-${id}`).disabled = false;
  document.getElementById(`chem-${id}`).disabled = false;
  document.getElementById(`phy-${id}`).disabled = false;
  document.getElementById(`bio-${id}`).disabled = false;
  document.getElementById(`maths-${id}`).disabled = false;

  document.getElementById(`edit-${id}`).style.display = "none";
  document.getElementById(`save-${id}`).style.display = "inline-block";
}

async function Save(id) {
  let data = {
    name: document.getElementById(`name-${id}`).value,
    age: document.getElementById(`age-${id}`).value,
    class: document.getElementById(`class-${id}`).value,
    chem: document.getElementById(`chem-${id}`).value,
    phy: document.getElementById(`phy-${id}`).value,
    bio: document.getElementById(`bio-${id}`).value,
    maths: document.getElementById(`maths-${id}`).value,
  };

  await fetch("/updateperson?id=" + id, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  Dispaly();
}

async function Delete(id) {
  await fetch("/deleteperson?id=" + id, {
    method: "DELETE",
  });

  Dispaly();
}
