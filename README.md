# rykap.com

This is my personal site. It's built with Jekyll.

# Development

```
# Install rbenv
brew install rbenv

# Install ruby version 2.7.1 (Jekyll requires > 2.5.0)
rbenv install 2.7.1

# Install gems
bundle install --path=vendor/bundle

# Install submodules (needed for GPU voronoi blog post)
git submodule update --recursive --remote

# Run the debug server
./debug.sh
```

To update gems, run `bundle update`.
