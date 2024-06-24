import husky from "husky";
import { Listr, delay } from "listr2";
import enquirer from "enquirer";
import { exec } from "child_process";

function execAsync(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        return reject(err);
      }

      if (stderr) {
        return console.error(stderr);
      }

      return resolve(stdout);
    });
  });
}

function logSilent(fn) {
  const originalLog = console.log;
  console.log = () => {};

  fn();

  console.log = originalLog;
}

async function runTasks() {
  try {
    const tasks = new Listr([
      {
        title: "Install husky",
        task: async () => {
          await delay(1000);
          logSilent(husky);
        },
      },
      {
        title: "Install turbo",
        task: async () => {
          await delay(1000);
          await execAsync("npm install -g turbo");
        },
      },
      {
        title: "Disable telemetry",
        task: (ctx, task) => {
          return task.newListr(
            [
              {
                title: "Disable Turbo telemetry",
                task: async () => {
                  await delay(1000);
                  await execAsync("npx turbo telemetry disable");
                },
              },
            ],
            { concurrent: true, rendererOptions: { collapseSubtasks: false } }
          );
        },
      },
    ]);

    await tasks.run();
  } catch (err) {
    console.error("Project setup error: ", err);
  }
}

if (process.env.NODE_ENV !== "production") {
  const prompt = new enquirer.Confirm({
    name: "question",
    message: "Want to setup?\n\n- husky\n- turbo\n- disable turbo telemetry\n",
  });

  const canceledText = "\nYou canceled the installation.";

  prompt
    .run()
    .then((answer) => {
      if (!answer) {
        console.log(canceledText);
        return;
      }

      runTasks();
    })
    .catch(() => console.log(canceledText));
}
