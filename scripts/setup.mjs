import husky from 'husky'
import { Listr, delay, color } from 'listr2'
import enquirer from 'enquirer'
import { exec } from 'child_process'

const asyncExec = command => {
  return new Promise((resolve, reject) => {
    const process = exec(command, (err, stdout, stderr) => {
      if (stderr) {
        console.error(`💡 stderr command: ${color.yellow(command)}`);
        console.error(`💡 stderr message:\n${stderr}`)
      }

      if (err) {
        return reject(err)
      }
      
      return resolve(stdout)
    })

    process.on('error', reject)
    process.on('exit', code => {
      if (code !== 0) {
        reject(new Error(`💡 command failed: ${color.yellow(command)}`))
      }
    })
  })
}

const logOff = cb => {
  const log = console.log

  console.log = () => {}

  try {
    cb()
  } finally {
    console.log = log
  }
}

async function runTasks() {
  try {
    const tasks = new Listr([
      {
        title: 'Install husky',
        task: async () => {
          await delay(1000)

          logOff(husky)
        },
      },
      {
        title: 'Install commitizen',
        task: async () => {
          await delay(1000)
          await asyncExec('npm install -g commitizen')
        },
      },
      {
        title: 'Install turbo',
        task: (context, task) => {
          return task.newListr(
            [
              {
                title: 'Install',
                task: async () => {
                  await delay(1000)
                  await asyncExec('npm install -g turbo')
                },
              },
              {
                title: 'Disable telemetry',
                task: async () => {
                  await delay(1000)
                  await asyncExec('npx turbo telemetry disable')
                },
              },
            ],
            { rendererOptions: { collapseSubtasks: false } },
          )
        },
      },
    ])

    await tasks.run()
    console.log(`\n💡 Use ${color.green('git cz')} instead of ${color.red('git commit')}`)
  } catch (err) {
    console.error('Project setup error: ', err)
  }
}

if (process.env.NODE_ENV !== 'production') {
  const prompt = new enquirer.Confirm({
    name: 'question',
    message: 'Want to setup?\n\n- husky\n- commitizen\n- turbo',
  })

  const message = '\nYou canceled the installation.'

  prompt
    .run()
    .then(answer => {
      if (!answer) {
        console.log(message)
        return
      }

      runTasks()
    })
    .catch(() => console.log(message))
}
