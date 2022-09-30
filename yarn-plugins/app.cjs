module.exports = {
	name: "@ff/yarn-plugin-app",
	factory: (require) => {
		const { BaseCommand } = require("@yarnpkg/cli");
		const { Command, Option } = require("clipanion");
		const t = require("typanion");

		class CDKCommand extends BaseCommand {
			app = Option.String();
			rest = Option.Proxy();

			async execute() {
				const cmd = ["workspace", this.app, "exec", "--", "cdk", this.path[1], ...this.rest];

				this.context.stdout.write(`${cmd.join(" ")}\n`);

				return this.cli.run(cmd);
			}
		}

		class DeployCommand extends CDKCommand {
			static paths = [["cdk", "deploy"]];

			static usage = Command.Usage({
				description: "Runs cdk deploy",
			});
		}

		class SynthCommand extends CDKCommand {
			static paths = [["cdk", "synth"]];

			static usage = Command.Usage({
				description: "Runs cdk synth",
			});
		}

		class TypeCheckCommand extends BaseCommand {
			static paths = [["tc"], ["type-check"]];

			static usage = Command.Usage({
				description: "Runs tsc --noEmit",
			});

			app = Option.String();
			rest = Option.Proxy();

			async execute() {
				const cmd = ["workspace", this.app, "exec", "--", "tsc", "--noEmit", ...this.rest];

				this.context.stdout.write(`${cmd.join(" ")}\n`);

				return this.cli.run(cmd);
			}
		}

		class TestCommand extends BaseCommand {
			static paths = [["test"], ["vitest"]];

			static usage = Command.Usage({
				description: "Runs vitest run --passWithNoTests",
			});

			app = Option.String();
			rest = Option.Proxy();

			async execute() {
				const cmd = ["workspace", this.app, "exec", "--", "vitest", "run", "--passWithNoTests", ...this.rest];

				this.context.stdout.write(`${cmd.join(" ")}\n`);

				return this.cli.run(cmd);
			}
		}

		return {
			commands: [DeployCommand, SynthCommand, TypeCheckCommand, TestCommand],
		};
	},
};
