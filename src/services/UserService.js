async function fetchWithTimeout(resource, options) {
      const { timeout = 8000 } = options;

      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(resource, {
        ...options,
        signal: controller.signal
      }).catch((error)=>{
            if(error.response){
                console.log("something went wrong")
                return null;
            }
            else{
                console.log("something went wrong on our side");
                return null
            }
      });
      clearTimeout(id);

      return response;
    }

export async function getEtmEnvs() {
  try {
    const response = await fetchWithTimeout("/api/ETMAutomation/loadEnv",{ timeout: 30000});
    return response.json();
  } catch (error) {
     console.log("Timeout")
    return [];
  }
}

//export async function getTables() {
//  try {
//    const response = await fetchWithTimeout("/api/ETMAutomation/loadTables",{ timeout: 30000});
//    return response.json();
//  } catch (error) {
//    console.log("Timeout")
//    return [];
//  }
//}

export async function getTables(environment) {
     try {
        return fetchWithTimeout("/api/ETMAutomation/loadTables", {
          method: "POST",
          timeout: 30000,
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": localStorage.getItem("token"),
          },
          body: JSON.stringify( {environment: environment}),
        }).then((data) => {
            return data.json();
        });

      } catch (error) {
        return [];
      }
}

export async function setEnv(environment, number) {
  try {
    return fetchWithTimeout("/api/ETMAutomation/getETMStatus", {
      method: "POST",
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        "Auth-Token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ ETMNumber: number, EnvName: environment }),
    }).then((data) => {
    localStorage.setItem("token", data.headers.get('Auth-Token'));
    return data.json();
    });

  } catch (error) {
    console.log("Timeout")
    return [];
  }
}

export async function setTables(environment, tables) {
  try {
    return fetchWithTimeout("/api/ETMAutomation/getTableList", {
      method: "POST",
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        "Auth-Token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ ETMNumber: tables, EnvName: environment }),
    }).then((data) => {
    localStorage.setItem("token", data.headers.get('Auth-Token'));
    return data.json();
    });

  } catch (error) {
    console.log("Timeout")
    return [];
  }
}

export async function initRelease(etmNumberList, environment) {
 try {
    return fetchWithTimeout("/api/ETMAutomation/initiateRelease", {
    method: "POST", timeout: 30000, headers: {
        "Content-Type": "application/json",
        "Auth-Token": localStorage.getItem("token"),
    },
    body: JSON.stringify({
        ETMNumber: etmNumberList,
        EnvName: environment,
        UserId: localStorage.getItem("userId"),
        }),
    }).then((data) =>{
    localStorage.setItem("token", data.headers.get('Auth-Token'));
    return data.json();
    });
    } catch (error) {
        return [];
    }
}

export async function initDeployment(etmTableList, environment) {
  try {
    return fetchWithTimeout("/api/ETMAutomation/initiateDeployment", {
      method: "POST",
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        "Auth-Token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        ETMTableName: etmTableList,
        EnvName: environment,
        UserId: localStorage.getItem("userId"),
      }),
    }).then((data) => {
    localStorage.setItem("token", data.headers.get('Auth-Token'));
    return data.json();
    });
  } catch (error) {
  console.log("Timeout")
    return [];
  }
}

export async function getETMsByDate(environment, initialDate, finalDate) {
  try {
    return fetchWithTimeout("/api/ETMAutomation/listETMs", {
      method: "POST",
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        "Auth-Token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        envName: environment,
        initialDate: initialDate,
        finalDate: finalDate,
      }),
    }).then((data) => {
    localStorage.setItem("token", data.headers.get('Auth-Token'));
    return data.json();
    });
  } catch (error) {
  console.log("Timeout")
    return [];
  }
}

export async function authenticateUser(username, password) {
  try {
    return fetchWithTimeout("/api/ETMAutomation/authentication", {
      method: "POST",
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: username,
        password: password,
      }),
    } )
  } catch (error) {
  console.log("Timeout")
    return [];
  }
}

export async function getDeploymentStats() {
  try {
    const response = await fetchWithTimeout("/api/ETMAutomation/loadDeploymentStat", { timeout: 30000});
    return response.json();
  } catch (error) {
  console.log("Timeout")
    return [];
  }
}

export async function getRefreshToken() {
  try {
      return fetchWithTimeout("/api/ETMAutomation/refreshToken", {
        method: "GET",
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
          "Auth-Token": localStorage.getItem("token"),
        },
      }).then((data) => {
      localStorage.setItem("token", data.headers.get('Auth-Token'));
      return data.json();
      });

    } catch (error) {
       console.log("Timeout")
      return [];
    }
}

// setEnv("2206.02");
