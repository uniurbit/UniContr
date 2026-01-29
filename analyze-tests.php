#!/usr/bin/env php
<?php
/**
 * Script per analizzare e elencare i test marker
 * 
 * Uso:
 *   php analyze-tests.php
 *   php analyze-tests.php --github-only
 *   php analyze-tests.php --requires-oracle
 */

class TestAnalyzer
{
    private $testFile;
    public $tests = [];

    public function __construct($testFile)
    {
        $this->testFile = $testFile;
        $this->parseTests();
    }

    private function parseTests()
    {
        $content = file_get_contents($this->testFile);
        
        // Regex per estrarre i test con i loro commenti
        $pattern = '/\/\*\*\s*(.*?)\*\/\s*(?:\/\/.*?\n)*\s*(?:public\s+)?function\s+(\w+)\s*\(/s';
        
        if (preg_match_all($pattern, $content, $matches)) {
            for ($i = 0; $i < count($matches[2]); $i++) {
                $docblock = $matches[1][$i];
                $testName = $matches[2][$i];
                
                // Salta se non è un test
                if (!preg_match('/^test/', $testName)) {
                    continue;
                }
                
                $this->tests[$testName] = [
                    'name' => $testName,
                    'github_executable' => $this->hasMarker($docblock, '@github-executable'),
                    'requires_database' => $this->hasMarker($docblock, '@requires-database') && !$this->hasMarker($docblock, '@requires-database-oracle'),
                    'requires_database_oracle' => $this->hasMarker($docblock, '@requires-database-oracle'),
                    'requires_user' => $this->extractMarker($docblock, '@requires-user'),
                    'requires_service' => $this->extractMarkers($docblock, '@requires-service'),
                    'docblock' => $docblock,
                ];
            }
        }
    }

    private function hasMarker($text, $marker)
    {
        return strpos($text, $marker) !== false;
    }

    private function extractMarker($text, $marker)
    {
        if (preg_match('/' . preg_quote($marker) . '\s+([^\n*]+)/', $text, $matches)) {
            return trim($matches[1]);
        }
        return null;
    }

    private function extractMarkers($text, $marker)
    {
        $markers = [];
        if (preg_match_all('/' . preg_quote($marker) . '\s+([^\n*]+)/', $text, $matches)) {
            $markers = array_map('trim', $matches[1]);
        }
        return $markers;
    }

    public function getGitHubExecutableTests()
    {
        return array_filter($this->tests, function($test) {
            return $test['github_executable'];
        });
    }

    public function getOracleRequiredTests()
    {
        return array_filter($this->tests, function($test) {
            return $test['requires_database_oracle'];
        });
    }

    public function getUserRequiredTests()
    {
        return array_filter($this->tests, function($test) {
            return $test['requires_user'] !== null;
        });
    }

    public function printReport($filter = null)
    {
        $total = count($this->tests);
        $github = count($this->getGitHubExecutableTests());
        $oracle = count($this->getOracleRequiredTests());
        $users = count($this->getUserRequiredTests());

        echo "\n";
        echo "╔════════════════════════════════════════════╗\n";
        echo "║         TEST MARKER ANALYSIS REPORT        ║\n";
        echo "╚════════════════════════════════════════════╝\n\n";

        echo sprintf("Total Tests: %d\n", $total);
        echo sprintf("GitHub Executable: %d (%.1f%%)\n", $github, ($github/$total)*100);
        echo sprintf("Oracle Required: %d (%.1f%%)\n", $oracle, ($oracle/$total)*100);
        echo sprintf("User Required: %d (%.1f%%)\n\n", $users, ($users/$total)*100);

        if ($filter === 'github-only') {
            $this->printGitHubTests();
        } elseif ($filter === 'oracle-only') {
            $this->printOracleTests();
        } elseif ($filter === 'user-only') {
            $this->printUserTests();
        } else {
            $this->printAllTests();
        }
    }

    private function printGitHubTests()
    {
        echo "✅ GITHUB EXECUTABLE TESTS (".count($this->getGitHubExecutableTests())."):\n";
        echo str_repeat("─", 50)."\n";
        
        foreach ($this->getGitHubExecutableTests() as $test) {
            echo sprintf("  • %s\n", $test['name']);
        }
        echo "\n";
    }

    private function printOracleTests()
    {
        echo "🔴 ORACLE REQUIRED TESTS (".count($this->getOracleRequiredTests())."):\n";
        echo str_repeat("─", 50)."\n";
        
        foreach ($this->getOracleRequiredTests() as $test) {
            echo sprintf("  • %s\n", $test['name']);
        }
        echo "\n";
    }

    private function printUserTests()
    {
        echo "👤 USER REQUIRED TESTS (".count($this->getUserRequiredTests())."):\n";
        echo str_repeat("─", 50)."\n";
        
        foreach ($this->getUserRequiredTests() as $test) {
            $user = $test['requires_user'] ?? 'Unknown';
            echo sprintf("  • %s (requires: %s)\n", $test['name'], $user);
        }
        echo "\n";
    }

    private function printAllTests()
    {
        echo "📋 ALL TESTS BY CATEGORY:\n";
        echo str_repeat("─", 50)."\n\n";

        // GitHub Executable
        $github = $this->getGitHubExecutableTests();
        if (count($github) > 0) {
            echo "✅ GitHub Executable (".count($github)."):\n";
            foreach ($github as $test) {
                echo sprintf("  • %s\n", $test['name']);
            }
            echo "\n";
        }

        // Oracle Required
        $oracle = $this->getOracleRequiredTests();
        if (count($oracle) > 0) {
            echo "🔴 Oracle Required (".count($oracle)."):\n";
            foreach ($oracle as $test) {
                echo sprintf("  • %s\n", $test['name']);
            }
            echo "\n";
        }

        // User Required
        $users = $this->getUserRequiredTests();
        if (count($users) > 0) {
            echo "👤 User Required (".count($users)."):\n";
            foreach ($users as $test) {
                $user = $test['requires_user'] ?? 'Unknown';
                $services = count($test['requires_service']) > 0 ? 
                    " (services: ".implode(', ', $test['requires_service']).")" : "";
                echo sprintf("  • %s (user: %s)%s\n", $test['name'], $user, $services);
            }
            echo "\n";
        }

        // Other
        $other = array_filter($this->tests, function($test) {
            return !$test['github_executable'] && 
                   !$test['requires_database_oracle'] && 
                   $test['requires_user'] === null;
        });

        if (count($other) > 0) {
            echo "❓ Other (".count($other)."):\n";
            foreach ($other as $test) {
                echo sprintf("  • %s\n", $test['name']);
            }
            echo "\n";
        }
    }

    public function generateFilterString()
    {
        $tests = $this->getGitHubExecutableTests();
        $names = array_keys($tests);
        return implode('|', $names);
    }
}

// Main
$testFile = __DIR__ . '/unicontract-backend/tests/Unit/ContrattiTest.php';
$firmaTestFile = __DIR__ . '/unicontract-backend/tests/Unit/FirmaTest.php';
$firmaMockedFile = __DIR__ . '/unicontract-backend/tests/Unit/FirmaTestMocked.php';

if (!file_exists($testFile)) {
    echo "❌ Test file not found: $testFile\n";
    exit(1);
}

$analyzer = new TestAnalyzer($testFile);

// Se esiste FirmaTest.php, analizzarlo
if (file_exists($firmaTestFile)) {
    $firmaAnalyzer = new TestAnalyzer($firmaTestFile);
    // Merger i test
    $analyzer->tests = array_merge($analyzer->tests, $firmaAnalyzer->tests);
}

// Se esiste FirmaTestMocked.php, analizzarlo e unire i test
if (file_exists($firmaMockedFile)) {
    $firmaMockAnalyzer = new TestAnalyzer($firmaMockedFile);
    $analyzer->tests = array_merge($analyzer->tests, $firmaMockAnalyzer->tests);
}

$filter = isset($argv[1]) ? $argv[1] : null;

if ($filter === '--github-only') {
    $analyzer->printReport('github-only');
    echo "Filter string for PHPUnit:\n";
    echo "  --filter \"" . $analyzer->generateFilterString() . "\"\n\n";
} elseif ($filter === '--oracle-only') {
    $analyzer->printReport('oracle-only');
} elseif ($filter === '--user-only') {
    $analyzer->printReport('user-only');
} else {
    $analyzer->printReport();
}

echo "\n";
?>
