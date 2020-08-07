// Types exposed by the project.

/**
 * The Unixorn component's props.
 */
export interface UnixornConfiguration {
  /**
   * List of commands to use instead of the default commands.
   */
  commands?: UnixornCommand[];

  /**
   * The message to show when Unixorn starts.
   */
  startupMessage?: string;
}

/**
 * A command that can be run on the command line.
 */
export interface UnixornCommand {
  /**
   * A string that demonstrates how the command is used.
   */
  usage: string;

  /**
   * A string that summarises the purpose of the command.
   */
  summary: string;

  /**
   * The actual code of the command.
   */
  action: (kernel: UnixornKernel, params: string[]) => void;
}

/**
 * The set of Unixorn system calls.
 */
export interface UnixornKernel {
  /**
   * Print text to stderr.
   */
  printErr: (text: string) => void;

  /**
   * Print text to stdout.
   */
  printOut: (text: string) => void;

  /**
   * Visit a URL.
   */
  visit: (url: string) => void;
}
